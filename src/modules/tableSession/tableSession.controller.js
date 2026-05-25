import createResponse from "../../common/utils/createResponse.js";
import handleAsync from "../../common/utils/handleAsync.js";
import createError from "../../common/utils/createError.js";
import TableSession from "./tableSession.model.js";
import Table from "../table/table.model.js";
import Order from "../order/order.model.js";

export const createTableSession = handleAsync(async (req, res) => {
  const tableSession = await TableSession.create({
    ...req.body,
    createdBy: req.user.id, // lấy từ token, không cần client gửi
  });
  res
    .status(201)
    .json(
      createResponse(
        true,
        201,
        "Table session created successfully",
        tableSession,
      ),
    );
});

export const getTableSessions = handleAsync(async (req, res) => {
  const { status, tableId } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (tableId) filter.tableId = tableId;

  const tableSessions = await TableSession.find(filter)
    .populate("tableId", "code name capacity")
    .populate("createdBy", "fullName email")
    .sort({ startedAt: -1 });

  res
    .status(200)
    .json(
      createResponse(
        true,
        200,
        "Table sessions retrieved successfully",
        tableSessions,
      ),
    );
});

export const getTableSessionDetail = handleAsync(async (req, res) => {
  const tableSession = await TableSession.findById(req.params.id)
    .populate("tableId", "code name capacity status")
    .populate("createdBy", "fullName email");

  if (!tableSession) throw createError(404, "Table session not found");

  res
    .status(200)
    .json(
      createResponse(
        true,
        200,
        "Table session retrieved successfully",
        tableSession,
      ),
    );
});

export const updateTableSession = handleAsync(async (req, res) => {
  const tableSession = await TableSession.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
  );
  if (!tableSession) throw createError(404, "Table session not found");
  res
    .status(200)
    .json(
      createResponse(
        true,
        200,
        "Table session updated successfully",
        tableSession,
      ),
    );
});

export const transferTableSession = handleAsync(async (req, res) => {
  const { id } = req.params;
  const { targetTableId } = req.body;

  if (!targetTableId) throw createError(400, "Bàn đích không được để trống");

  const session = await TableSession.findById(id);
  if (!session) throw createError(404, "Không tìm thấy phiên hoạt động");
  if (session.status !== "active")
    throw createError(400, "Phiên hoạt động này không còn hiệu lực");

  const oldTableId = session.tableId;
  if (String(oldTableId) === String(targetTableId)) {
    throw createError(400, "Bàn đích trùng với bàn hiện tại");
  }

  const targetTable = await Table.findById(targetTableId);
  if (!targetTable) throw createError(404, "Không tìm thấy bàn đích");
  if (targetTable.status !== "available") {
    throw createError(
      400,
      `Bàn đích ${targetTable.code || targetTable.name} đang không trống`,
    );
  }

  // 1. Update TableSession table ID
  session.tableId = targetTableId;
  await session.save();

  // 2. Set target table status to occupied
  targetTable.status = "occupied";
  await targetTable.save();

  // 3. Set old table status to available
  const oldTable = await Table.findById(oldTableId);
  if (oldTable) {
    oldTable.status = "available";
    await oldTable.save();
  }

  // 4. Update tableId in all non-completed orders for this session
  await Order.updateMany(
    { tableSessionId: session._id, status: { $ne: "completed" } },
    { tableId: targetTableId },
  );

  res
    .status(200)
    .json(createResponse(true, 200, "Chuyển bàn thành công", session));
});

export const deleteTableSession = handleAsync(async (req, res) => {
  const tableSession = await TableSession.findByIdAndDelete(req.params.id);
  if (!tableSession) {
    return res
      .status(404)
      .json(createResponse(false, 404, "Table session not found"));
  }
  res
    .status(200)
    .json(createResponse(true, 200, "Table session deleted successfully"));
});
