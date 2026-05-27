import crypto from "crypto";
import createResponse from "../../common/utils/createResponse.js";
import handleAsync from "../../common/utils/handleAsync.js";
import createError from "../../common/utils/createError.js";
import Payment from "./payment.model.js";
import TableSession from "../tableSession/tableSession.model.js";
import Order from "../order/order.model.js";
import Table from "../table/table.model.js";

function generatePaymentCode() {
  return `PAY-${Date.now().toString(36).toUpperCase().slice(-8)}`;
}

// POST /payments  — tạo giao dịch thanh toán (pending)
export const createPayment = handleAsync(async (req, res) => {
  const { tableSessionId, method, discount = 0 } = req.body;

  const session = await TableSession.findById(tableSessionId);
  if (!session) throw createError(404, "Không tìm thấy phiên bàn");
  if (session.status === "paid")
    throw createError(400, "Phiên này đã được thanh toán");
  if (session.status !== "active")
    throw createError(400, "Phiên bàn không còn hoạt động");

  // Tính tổng tiền từ tất cả orders của session
  const orders = await Order.find({
    tableSessionId,
    status: { $ne: "cancelled" },
  });

  if (!orders.length)
    throw createError(400, "Chưa có đơn hàng để thanh toán");

  const subtotal = orders.reduce(
    (s, o) => s + (o.finalAmount ?? o.subtotal ?? 0),
    0,
  );
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

  res
    .status(201)
    .json(createResponse(true, 201, "Tạo giao dịch thành công", payment));
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
    status: "paid",
    endedAt: new Date(),
  });

  // update orders
  await Order.updateMany(
    {
      tableSessionId: payment.tableSessionId,
      status: { $ne: "cancelled" },
    },
    {
      status: "completed",
      paymentStatus: "paid",
    },
  );

  // reset table
  const newQrToken =
    typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : crypto.randomBytes(16).toString("hex");

  await Table.findByIdAndUpdate(session.tableId, {
    status: "available",
    qrToken: newQrToken,
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
