import mongoose from "mongoose";
import createResponse from "../../common/utils/createResponse.js";
import handleAsync from "../../common/utils/handleAsync.js";
import createError from "../../common/utils/createError.js";
import Order from "./order.model.js";
import OrderItem from "./orderItem.model.js";
import MenuItem from "../menu-item/menu-item.model.js";
import TableSession from "../tableSession/tableSession.model.js";
import Table from "../table/table.model.js";

// Tạo orderNumber duy nhất: ORD-YYYYMMDD-XXXX
async function generateOrderNumber() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const count = await Order.countDocuments();
  return `ORD-${date}-${String(count + 1).padStart(4, "0")}`;
}

// POST /orders/staff  — staff/admin order hộ khách
export const staffCreateOrder = handleAsync(async (req, res) => {
  const {
    tableId,
    items,
    note,
    discount = 0,
    customerName,
    guestCount,
  } = req.body;

  if (!items?.length) throw createError(400, "Cần ít nhất 1 món");

  // Lấy thông tin menu items
  const menuItemIds = items.map((i) => i.menuItemId);
  const menuItems = await MenuItem.find({
    _id: { $in: menuItemIds },
    status: "active",
    isAvailable: true,
  });

  if (menuItems.length !== menuItemIds.length)
    throw createError(400, "Một số món không tồn tại hoặc không khả dụng");

  const menuMap = Object.fromEntries(
    menuItems.map((m) => [m._id.toString(), m]),
  );

  // Tính tiền
  const orderItemsData = items.map((i) => {
    const menu = menuMap[i.menuItemId];
    const price = menu.salePrice ?? menu.price;
    return {
      menuItemId: menu._id,
      name: menu.name,
      image: menu.image,
      price,
      quantity: i.quantity,
      subtotal: price * i.quantity,
      note: i.note ?? null,
    };
  });

  const subtotal = orderItemsData.reduce((s, i) => s + i.subtotal, 0);
  const finalAmount = Math.max(0, subtotal - discount);

  // Tìm hoặc tạo TableSession active
  let session = await TableSession.findOne({ tableId, status: "active" });
  if (!session) {
    session = await TableSession.create({
      tableId,
      createdBy: req.user.id,
      customerName: customerName ?? null,
      guestCount: guestCount ?? 1,
      status: "active",
    });
    await Table.findByIdAndUpdate(tableId, { status: "occupied" });
  }

  // Tạo order
  const order = await Order.create({
    tableSessionId: session._id,
    tableId,
    confirmedBy: req.user.id,
    orderNumber: await generateOrderNumber(),
    orderSource: req.user.role === "admin" ? "admin" : "staff",
    status: "confirmed",
    subtotal,
    discount,
    finalAmount,
    note: note ?? null,
  });

  // Tạo order items
  const createdItems = await OrderItem.insertMany(
    orderItemsData.map((i) => ({
      ...i,
      orderId: order._id,
      status: "pending",
    })),
  );

  res
    .status(201)
    .json(
      createResponse(true, 201, "Tạo đơn hàng thành công", {
        order,
        items: createdItems,
      }),
    );
});

// GET /orders  — admin và staff thấy tất cả các đơn
export const getOrders = handleAsync(async (req, res) => {
  const { status, tableId, page = 1, limit = 20 } = req.query;
  const filter = {};

  if (status) filter.status = status;
  if (tableId) filter.tableId = tableId;

  const skip = (Number(page) - 1) * Number(limit);
  const orders = await Order.find(filter)
    .populate("tableId", "code name capacity")
    .populate("confirmedBy", "fullName email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  res
    .status(200)
    .json(createResponse(true, 200, "Orders retrieved successfully", orders));
});

export const getOrderDetail = handleAsync(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("tableId", "code name capacity")
    .populate("confirmedBy", "fullName email")
    .populate("servedBy", "fullName email");

  if (!order) throw createError(404, "Order not found");

  const items = await OrderItem.find({ orderId: order._id }).populate(
    "menuItemId",
    "name price image",
  );

  res
    .status(200)
    .json(
      createResponse(true, 200, "Order retrieved successfully", {
        order,
        items,
      }),
    );
});

export const updateOrder = handleAsync(async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!order) throw createError(404, "Order not found");
  res
    .status(200)
    .json(createResponse(true, 200, "Order updated successfully", order));
});

export const deleteOrder = handleAsync(async (req, res) => {
  const order = await Order.findByIdAndDelete(req.params.id);
  if (!order) {
    return res.status(404).json(createResponse(false, 404, "Order not found"));
  }
  res.status(200).json(createResponse(true, 200, "Order deleted successfully"));
});
