import createResponse from "../../common/utils/createResponse.js";
import handleAsync from "../../common/utils/handleAsync.js";
import ServiceCall from "./serviceCall.model.js";
import Table from "../table/table.model.js";
import TableSession from "../tableSession/tableSession.model.js";
import ActivityLog from "../activityLog/activityLog.model.js";
import { getIO } from "../../common/configs/socket.js";

// Helper to safely emit socket events
const emitSocketEvent = (event, data) => {
  try {
    const io = getIO();
    io.emit(event, data);
  } catch (err) {
    console.error(`[Socket IO] Error emitting event ${event}:`, err.message);
  }
};

export const createServiceCall = handleAsync(async (req, res) => {
  const serviceCall = await ServiceCall.create(req.body);
  
  const populatedCall = await ServiceCall.findById(serviceCall._id)
    .populate("tableId", "name code")
    .populate("handledBy", "fullName email");

  // Emit event to staff
  emitSocketEvent("new_service_call", populatedCall);

  // Ghi log hoạt động
  try {
    const table = await Table.findById(serviceCall.tableId);
    await ActivityLog.create({
      userId: req.user?.id || null,
      entityId: serviceCall._id,
      entityType: "service_call",
      action: "create",
      description: `Nhân viên tạo yêu cầu hỗ trợ cho Bàn ${table?.code || table?.name || "chưa rõ"}: ${serviceCall.note || serviceCall.type}`,
    });
  } catch (logErr) {
    console.error("[ActivityLog] Lỗi tạo log:", logErr.message);
  }

  res.status(201).json(
    createResponse(
      true,
      201,
      "Service call created successfully",
      populatedCall,
    ),
  );
});

// API tạo yêu cầu hỗ trợ của khách hàng (Public)
export const createGuestServiceCall = handleAsync(async (req, res) => {
  const { tableId, type, note } = req.body;

  // 1. Kiểm tra bàn tồn tại
  const table = await Table.findById(tableId);
  if (!table) {
    return res.status(404).json(
      createResponse(false, 404, "Không tìm thấy thông tin bàn ăn.")
    );
  }

  // 2. Kiểm tra TableSession đang hoạt động (active hoặc waiting_payment)
  const activeSession = await TableSession.findOne({
    tableId,
    status: { $in: ["active", "waiting_payment"] },
  });

  if (!activeSession) {
    return res.status(400).json(
      createResponse(false, 400, "Bàn chưa được mở phiên hoạt động. Vui lòng liên hệ nhân viên để mở bàn.")
    );
  }

  // 3. Chống spam: kiểm tra yêu cầu chưa hoàn thành (pending hoặc handling)
  const existingCall = await ServiceCall.findOne({
    tableId,
    status: { $in: ["pending", "handling"] },
  });

  if (existingCall) {
    return res.status(400).json(
      createResponse(false, 400, "Yêu cầu trước của bạn đang được xử lý. Vui lòng chờ nhân viên hỗ trợ.")
    );
  }

  // 4. Tạo ServiceCall mới
  const serviceCall = await ServiceCall.create({
    tableId,
    tableSessionId: activeSession._id,
    type,
    status: "pending",
    handledBy: null,
    note: note || null,
  });

  const populatedCall = await ServiceCall.findById(serviceCall._id)
    .populate("tableId", "name code")
    .populate("handledBy", "fullName email");

  // 5. Emit socket sự kiện new_service_call
  emitSocketEvent("new_service_call", populatedCall);

  // 6. Ghi ActivityLog
  try {
    await ActivityLog.create({
      userId: null,
      entityId: serviceCall._id,
      entityType: "service_call",
      action: "create",
      description: `Bàn ${table.code || table.name} gửi yêu cầu: ${note || type}`,
    });
  } catch (logErr) {
    console.error("[ActivityLog] Lỗi tạo log:", logErr.message);
  }

  res.status(201).json(
    createResponse(
      true,
      201,
      "Yêu cầu đã được gửi tới nhân viên",
      populatedCall,
    ),
  );
});

export const getServiceCalls = handleAsync(async (req, res) => {
  const { status } = req.query;
  const filter = {};

  if (status) {
    if (status.includes(",")) {
      filter.status = { $in: status.split(",") };
    } else {
      filter.status = status;
    }
  }

  const serviceCalls = await ServiceCall.find(filter)
    .populate("tableId", "name code capacity")
    .populate("handledBy", "fullName email")
    .sort({ createdAt: -1 });

  res.status(200).json(
    createResponse(
      true,
      200,
      "Service calls retrieved successfully",
      serviceCalls,
    ),
  );
});

export const getServiceCallDetail = handleAsync(async (req, res) => {
  const serviceCall = await ServiceCall.findById(req.params.id)
    .populate("tableId", "name code")
    .populate("handledBy", "fullName email");

  if (!serviceCall) {
    return res
      .status(404)
      .json(createResponse(false, 404, "Service call not found"));
  }
  res.status(200).json(
    createResponse(
      true,
      200,
      "Service call retrieved successfully",
      serviceCall,
    ),
  );
});

export const updateServiceCall = handleAsync(async (req, res) => {
  const oldCall = await ServiceCall.findById(req.params.id);
  if (!oldCall) {
    return res
      .status(404)
      .json(createResponse(false, 404, "Service call not found"));
  }

  const updateData = { ...req.body };

  // Nếu chuyển đổi trạng thái sang handling, tự động gán nhân viên hiện tại
  if (updateData.status === "handling" && !updateData.handledBy && req.user) {
    updateData.handledBy = req.user.id;
  }

  const serviceCall = await ServiceCall.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true },
  )
    .populate("tableId", "name code")
    .populate("handledBy", "fullName email");

  // Emit event theo trạng thái mới
  if (serviceCall.status === "handling") {
    emitSocketEvent("service_call_handling", serviceCall);
  } else if (serviceCall.status === "completed") {
    emitSocketEvent("service_call_completed", serviceCall);
  } else {
    emitSocketEvent("service_call_updated", serviceCall);
  }

  // Ghi log hoạt động
  try {
    let action = "update";
    let description = `Cập nhật yêu cầu hỗ trợ của Bàn ${serviceCall.tableId?.code || serviceCall.tableId?.name}`;

    if (oldCall.status !== serviceCall.status) {
      if (serviceCall.status === "handling") {
        action = "update";
        description = `Nhân viên ${serviceCall.handledBy?.fullName || "ẩn danh"} nhận xử lý yêu cầu của Bàn ${serviceCall.tableId?.code || serviceCall.tableId?.name}: ${serviceCall.note || serviceCall.type}`;
      } else if (serviceCall.status === "completed") {
        action = "update";
        description = `Nhân viên ${req.user?.fullName || serviceCall.handledBy?.fullName || "ẩn danh"} hoàn thành yêu cầu của Bàn ${serviceCall.tableId?.code || serviceCall.tableId?.name}`;
      }
    }

    await ActivityLog.create({
      userId: req.user?.id || null,
      entityId: serviceCall._id,
      entityType: "service_call",
      action,
      description,
    });
  } catch (logErr) {
    console.error("[ActivityLog] Lỗi tạo log:", logErr.message);
  }

  res.status(200).json(
    createResponse(
      true,
      200,
      "Service call updated successfully",
      serviceCall,
    ),
  );
});

export const deleteServiceCall = handleAsync(async (req, res) => {
  const serviceCall = await ServiceCall.findByIdAndDelete(req.params.id);
  if (!serviceCall) {
    return res
      .status(404)
      .json(createResponse(false, 404, "Service call not found"));
  }
  res.status(200).json(createResponse(true, 200, "Service call deleted successfully"));
});
