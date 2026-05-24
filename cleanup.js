import mongoose from "mongoose";
import { configenv } from "./src/common/configs/configenv.js";
import { normalizeMongoUri } from "./src/common/configs/normalizeMongoUri.js";
import Table from "./src/modules/table/table.model.js";
import TableSession from "./src/modules/tableSession/tableSession.model.js";
import Order from "./src/modules/order/order.model.js";
import OrderItem from "./src/modules/order/orderItem.model.js";
import Payment from "./src/modules/payment/payment.model.js";
import Reservation from "./src/modules/reservation/reservation.model.js";
import ServiceCall from "./src/modules/serviceCall/serviceCall.model.js";
import ActivityLog from "./src/modules/activityLog/activityLog.model.js";
import crypto from "crypto";

async function cleanup() {
  console.log(" đang kết nối tới cơ sở dữ liệu MongoDB...");
  await mongoose.connect(normalizeMongoUri(configenv.MONGODB_URI));
  console.log(" Kết nối cơ sở dữ liệu thành công!");

  console.log(" Đang xóa toàn bộ dữ liệu giao dịch động...");
  const deleteTableSessions = await TableSession.deleteMany({});
  const deleteOrders = await Order.deleteMany({});
  const deleteOrderItems = await OrderItem.deleteMany({});
  const deletePayments = await Payment.deleteMany({});
  const deleteReservations = await Reservation.deleteMany({});
  const deleteServiceCalls = await ServiceCall.deleteMany({});
  const deleteActivityLogs = await ActivityLog.deleteMany({});

  console.log(` Đã xóa thành công:
  - ${deleteTableSessions.deletedCount} phiên hoạt động bàn (Table Sessions)
  - ${deleteOrders.deletedCount} đơn hàng (Orders)
  - ${deleteOrderItems.deletedCount} món ăn trong đơn (Order Items)
  - ${deletePayments.deletedCount} giao dịch thanh toán (Payments)
  - ${deleteReservations.deletedCount} đơn đặt bàn trước (Reservations)
  - ${deleteServiceCalls.deletedCount} yêu cầu phục vụ (Service Calls)
  - ${deleteActivityLogs.deletedCount} nhật ký hoạt động (Activity Logs)
  `);

  console.log(" Đang đặt lại trạng thái của tất cả các bàn thành 'available' (Trống) và làm mới mã QR...");
  const tables = await Table.find({});
  for (const table of tables) {
    table.status = "available";
    // Đảm bảo sinh mã QR mới tương thích mọi phiên bản Node.js
    table.qrToken = typeof crypto.randomUUID === "function" 
      ? crypto.randomUUID() 
      : crypto.randomBytes(16).toString("hex");
    await table.save();
  }
  console.log(` Đã đặt lại trạng thái trống cho ${tables.length} bàn thành công!`);

  await mongoose.disconnect();
  console.log(" Ngắt kết nối DB. Quá trình dọn dẹp hoàn tất hoàn hảo!");
}

cleanup().catch((err) => {
  console.error("❌ Quá trình dọn dẹp dữ liệu thất bại:", err);
  mongoose.disconnect();
  process.exit(1);
});
