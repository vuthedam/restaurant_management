import createResponse from "../../common/utils/createResponse.js";
import handleAsync from "../../common/utils/handleAsync.js";
import Category from "../category/category.model.js";
import MenuItem from "../menu-item/menu-item.model.js";
import Table from "../table/table.model.js";
import TableSession from "../tableSession/tableSession.model.js";
import Order from "../order/order.model.js";
import OrderItem from "../order/orderItem.model.js";
import Reservation from "../reservation/reservation.model.js";
import { User } from "../user/user.model.js";
import ServiceCall from "../serviceCall/serviceCall.model.js";

export const getPublicMenu = handleAsync(async (req, res) => {
  const categories = await Category.find({ status: "active" }).sort({ sortOrder: 1 }).lean();
  const items = await MenuItem.find({
    status: "active",
    isAvailable: true,
  })
    .sort({ isFeatured: -1, name: 1 })
    .lean();

  const categoryMap = Object.fromEntries(categories.map((c) => [String(c._id), c]));

  const menuByCategory = categories.map((cat) => ({
    ...cat,
    items: items
      .filter((item) => String(item.categoryId) === String(cat._id))
      .map((item) => ({
        ...item,
        unitPrice: item.salePrice ?? item.price,
      })),
  }));

  res.status(200).json(
    createResponse(true, 200, "Menu retrieved successfully", {
      categories: menuByCategory,
      items: items.map((item) => ({
        ...item,
        unitPrice: item.salePrice ?? item.price,
        categoryName: categoryMap[String(item.categoryId)]?.name ?? "",
      })),
    }),
  );
});
import { recalculateOrder } from "../order/orderItem.controller.js";

export const getTableByQr = handleAsync(async (req, res) => {
  const table = await Table.findOne({
    qrToken: req.params.qrToken,
    isActive: true,
  }).select("name code capacity status qrToken");

  if (!table) {
    return res.status(404).json(createResponse(false, 404, "Không tìm thấy bàn"));
  }

  // Find active session to get sitting guests
  const session = await TableSession.findOne({
    tableId: table._id,
    status: "active",
  });

  let activeOrders = [];
  let activeOrderItems = [];

  if (session) {
    activeOrders = await Order.find({
      tableSessionId: session._id,
      status: { $ne: "cancelled" },
    }).sort({ createdAt: -1 });

    const orderIds = activeOrders.map((o) => o._id);
    activeOrderItems = await OrderItem.find({
      orderId: { $in: orderIds },
    })
      .populate("menuItemId", "name price image")
      .sort({ createdAt: 1 });
  }

  // Find active support request (ServiceCall)
  const activeServiceCall = await ServiceCall.findOne({
    tableId: table._id,
    status: { $in: ["pending", "handling"] },
  }).populate("handledBy", "fullName email");

  const result = {
    ...table.toObject(),
    activeSession: session
      ? { _id: session._id, guestCount: session.guestCount }
      : null,
    activeGuestCount: session ? session.guestCount : 0,
    activeOrders,
    activeOrderItems,
    activeServiceCall,
  };

  res.status(200).json(createResponse(true, 200, "OK", result));
});

export const cancelPendingOrderItem = handleAsync(async (req, res) => {
  const { id } = req.params;

  const orderItem = await OrderItem.findById(id);
  if (!orderItem) {
    return res
      .status(404)
      .json(createResponse(false, 404, "Không tìm thấy món ăn trong đơn"));
  }

  if (orderItem.status !== "pending") {
    return res
      .status(400)
      .json(
        createResponse(
          false,
          400,
          "Món ăn đã được bếp chế biến hoặc phục vụ, không thể tự hủy. Vui lòng liên hệ nhân viên.",
        ),
      );
  }

  // Set status to cancelled
  orderItem.status = "cancelled";
  await orderItem.save();

  // Recalculate parent order
  await recalculateOrder(orderItem.orderId);

  res
    .status(200)
    .json(createResponse(true, 200, "Hủy món ăn thành công", orderItem));
});

export const placeGuestOrder = handleAsync(async (req, res) => {
  const { qrToken, items, note } = req.body;

  const table = await Table.findOne({ qrToken, isActive: true });
  if (!table) {
    return res.status(404).json(createResponse(false, 404, "Không tìm thấy bàn"));
  }

  const staffUser = await User.findOne({
    isActive: true,
    role: { $in: ["admin", "staff"] },
  });

  if (!staffUser) {
    return res
      .status(503)
      .json(createResponse(false, 503, "Hệ thống chưa sẵn sàng nhận đơn"));
  }

  const menuIds = items.map((i) => i.menuItemId);
  const menuItems = await MenuItem.find({
    _id: { $in: menuIds },
    status: "active",
    isAvailable: true,
  });

  if (menuItems.length !== items.length) {
    return res
      .status(400)
      .json(createResponse(false, 400, "Có món không còn bán hoặc không hợp lệ"));
  }

  const menuMap = Object.fromEntries(menuItems.map((m) => [String(m._id), m]));

  let session = await TableSession.findOne({
    tableId: table._id,
    status: "active",
  });

  if (!session) {
    session = await TableSession.create({
      tableId: table._id,
      createdBy: staffUser._id,
      guestCount: 1,
      status: "active",
    });
    if (table.status === "available") {
      table.status = "occupied";
      await table.save();
    }
  }

  const orderLines = items.map((line) => {
    const menu = menuMap[line.menuItemId];
    const unitPrice = menu.salePrice ?? menu.price;
    const quantity = line.quantity;
    return {
      menuItemId: menu._id,
      name: menu.name,
      image: menu.image,
      quantity,
      price: unitPrice,
      subtotal: unitPrice * quantity,
      note: line.note || null,
    };
  });

  const subtotal = orderLines.reduce((sum, line) => sum + line.subtotal, 0);
  const orderNumber = `ORD-${Date.now().toString(36).toUpperCase().slice(-8)}`;

  const order = await Order.create({
    tableSessionId: session._id,
    tableId: table._id,
    orderNumber,
    orderSource: "qr",
    status: "pending",
    subtotal,
    discount: 0,
    finalAmount: subtotal,
    note: note || null,
  });

  const orderItems = await OrderItem.insertMany(
    orderLines.map((line) => ({
      orderId: order._id,
      menuItemId: line.menuItemId,
      name: line.name,
      image: line.image,
      quantity: line.quantity,
      price: line.price,
      subtotal: line.subtotal,
      note: line.note,
      status: "pending",
    })),
  );

  res.status(201).json(
    createResponse(true, 201, "Đặt món thành công", {
      order,
      items: orderItems,
      table: { name: table.name, code: table.code },
    }),
  );
});

export const placeGuestReservation = handleAsync(async (req, res) => {
  const { customerName, phone, guestCount, reservationDate, reservationTime, note } = req.body;

  // Generate unique reservationCode
  const reservationCode = `RES-${Date.now().toString(36).toUpperCase().slice(-6)}`;

  const reservation = await Reservation.create({
    reservationCode,
    customerName,
    phone,
    guestCount: Number(guestCount),
    reservationDate,
    reservationTime,
    note: note || null,
    source: "website",
    status: "pending",
  });

  res.status(201).json(
    createResponse(true, 201, "Đặt bàn thành công, vui lòng chờ nhân viên xác nhận", reservation)
  );
});
