import crypto from "crypto";
import createResponse from "../../common/utils/createResponse.js";
import handleAsync from "../../common/utils/handleAsync.js";
import createError from "../../common/utils/createError.js";
import Payment from "./payment.model.js";
import TableSession from "../tableSession/tableSession.model.js";
import Order from "../order/order.model.js";
import OrderItem from "../order/orderItem.model.js";
import Table from "../table/table.model.js";

function generatePaymentCode() {
  return `PAY-${Date.now().toString(36).toUpperCase().slice(-8)}`;
}

/** Chỉ tính tiền các món đã lên bàn (status: served). */
async function getServedItemsForSession(tableSessionId) {
  const orders = await Order.find({
    tableSessionId,
    status: { $ne: "cancelled" },
  }).select("_id");

  if (!orders.length) {
    return { servedItems: [], unservedCount: 0, orderIds: [] };
  }

  const orderIds = orders.map((o) => o._id);

  const [servedItems, unservedCount] = await Promise.all([
    OrderItem.find({ orderId: { $in: orderIds }, status: "served" }),
    OrderItem.countDocuments({
      orderId: { $in: orderIds },
      status: { $nin: ["served", "cancelled"] },
    }),
  ]);

  return { servedItems, unservedCount, orderIds };
}

function sumItemSubtotals(items) {
  return items.reduce(
    (sum, item) => sum + (item.subtotal ?? item.price * item.quantity),
    0,
  );
}

// POST /payments  — tạo giao dịch thanh toán (pending)
export const createPayment = handleAsync(async (req, res) => {
  const { tableSessionId, method, discount = 0 } = req.body;

  const session = await TableSession.findById(tableSessionId);
  if (!session) throw createError(404, "Không tìm thấy phiên bàn");
  if (session.status === "paid" || session.status === "closed")
    throw createError(400, "Phiên này đã được thanh toán");
  if (session.status !== "active")
    throw createError(400, "Phiên bàn không còn hoạt động");

  const { servedItems, unservedCount, orderIds } =
    await getServedItemsForSession(tableSessionId);

  if (!orderIds.length)
    throw createError(400, "Chưa có đơn hàng để thanh toán");

  if (!servedItems.length)
    throw createError(
      400,
      "Chưa có món nào đã lên bàn. Vui lòng phục vụ món trước khi thanh toán.",
    );

  const subtotal = sumItemSubtotals(servedItems);
  const amount = Math.max(0, subtotal - discount);

  if (amount <= 0)
    throw createError(400, "Tổng tiền thanh toán phải lớn hơn 0");

  // Xóa payment pending cũ nếu có (tạo lại)
  await Payment.deleteMany({ tableSessionId, status: "pending" });

  const payment = await Payment.create({
    tableSessionId,
    paidBy: req.user.id,
    paymentCode: generatePaymentCode(),
    amount,
    method,
    status: "pending",
  });

  // Chỉ đổi trạng thái bàn/phiên khi xác nhận thanh toán (confirmPayment)

  res.status(201).json(
    createResponse(true, 201, "Tạo giao dịch thành công", {
      ...payment.toObject(),
      servedItemCount: servedItems.length,
      unservedItemCount: unservedCount,
    }),
  );
});

// POST /payments/:id/confirm  — xác nhận thanh toán thành công → reset bàn
export const confirmPayment = handleAsync(async (req, res) => {
  const payment = await Payment.findById(req.params.id);

  if (!payment) {
    throw createError(404, "Không tìm thấy giao dịch");
  }

  if (payment.status !== "pending") {
    throw createError(400, "Giao dịch không hợp lệ");
  }

  const session = await TableSession.findById(payment.tableSessionId);

  if (!session) {
    throw createError(404, "Không tìm thấy phiên bàn");
  }

  // update payment
  payment.status = "paid";
  payment.paidAt = new Date();
  payment.transactionId = req.body?.transactionId ?? null;

  await payment.save();

  // update session + bàn: chỉ khi đã xác nhận thu tiền
  await TableSession.findByIdAndUpdate(payment.tableSessionId, {
    status: "closed",
    endedAt: new Date(),
  });

  // Chỉ hoàn tất các đơn mà mọi món (không hủy) đã lên bàn
  const sessionOrders = await Order.find({
    tableSessionId: payment.tableSessionId,
    status: { $ne: "cancelled" },
  });

  for (const order of sessionOrders) {
    const items = await OrderItem.find({ orderId: order._id });
    const activeItems = items.filter((item) => item.status !== "cancelled");
    if (!activeItems.length) continue;

    const allServed = activeItems.every((item) => item.status === "served");
    if (allServed) {
      order.status = "completed";
      order.paymentStatus = "paid";
      await order.save();
    }
  }

  // reset table
  await Table.findByIdAndUpdate(session.tableId, {
    status: "available",
  });

  res
    .status(200)
    .json(createResponse(true, 200, "Thanh toán thành công", payment));
});

export const getPayments = handleAsync(async (req, res) => {
  const payments = await Payment.find()
    .populate("tableSessionId", "customerName guestCount")
    .populate("paidBy", "fullName")
    .sort({ createdAt: -1 });
  res
    .status(200)
    .json(
      createResponse(true, 200, "Payments retrieved successfully", payments),
    );
});

export const getPaymentDetail = handleAsync(async (req, res) => {
  const payment = await Payment.findById(req.params.id)
    .populate("tableSessionId")
    .populate("paidBy", "fullName");
  if (!payment) throw createError(404, "Payment not found");
  res
    .status(200)
    .json(createResponse(true, 200, "Payment retrieved successfully", payment));
});

export const updatePayment = handleAsync(async (req, res) => {
  const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!payment) throw createError(404, "Payment not found");
  res
    .status(200)
    .json(createResponse(true, 200, "Payment updated successfully", payment));
});

export const deletePayment = handleAsync(async (req, res) => {
  const payment = await Payment.findByIdAndDelete(req.params.id);
  if (!payment) {
    return res
      .status(404)
      .json(createResponse(false, 404, "Payment not found"));
  }
  res
    .status(200)
    .json(createResponse(true, 200, "Payment deleted successfully"));
});
