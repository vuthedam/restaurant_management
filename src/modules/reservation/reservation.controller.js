import createResponse from "../../common/utils/createResponse.js";
import handleAsync from "../../common/utils/handleAsync.js";
import createError from "../../common/utils/createError.js";
import Reservation from "./reservation.model.js";
import Table from "../table/table.model.js";
import TableSession from "../tableSession/tableSession.model.js";

export const createReservation = handleAsync(async (req, res) => {
  const reservation = await Reservation.create(req.body);
  res
    .status(201)
    .json(
      createResponse(
        true,
        201,
        "Reservation created successfully",
        reservation,
      ),
    );
});

export const getReservations = handleAsync(async (req, res) => {
  const reservations = await Reservation.find()
    .populate("assignedTableId", "code name capacity")
    .sort({ reservationDate: -1, createdAt: -1 });
  res
    .status(200)
    .json(
      createResponse(
        true,
        200,
        "Reservations retrieved successfully",
        reservations,
      ),
    );
});

export const getReservationDetail = handleAsync(async (req, res) => {
  const reservation = await Reservation.findById(req.params.id);
  if (!reservation) {
    return res
      .status(404)
      .json(createResponse(false, 404, "Reservation not found"));
  }
  res
    .status(200)
    .json(
      createResponse(
        true,
        200,
        "Reservation retrieved successfully",
        reservation,
      ),
    );
});

export const updateReservation = handleAsync(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const reservation = await Reservation.findById(id);
  if (!reservation) throw createError(404, "Reservation not found");

  const oldStatus = reservation.status;
  const newStatus = updates.status;
  const oldTableId = reservation.assignedTableId;

  // Apply updates to reservation document
  Object.assign(reservation, updates);

  // If status transitions
  if (newStatus && oldStatus !== newStatus) {
    if (newStatus === "confirmed") {
      // If table is assigned, mark table as reserved
      if (reservation.assignedTableId) {
        await Table.findByIdAndUpdate(reservation.assignedTableId, {
          status: "reserved",
        });
      }
    } else if (newStatus === "checked_in") {
      // Must have an assigned table to check in
      if (!reservation.assignedTableId) {
        throw createError(400, "Vui lòng gán bàn trước khi check-in");
      }

      // Check if table is available or reserved
      const table = await Table.findById(reservation.assignedTableId);
      if (!table) throw createError(404, "Bàn được gán không tồn tại");
      if (table.status === "occupied" && table.status !== "reserved") {
        throw createError(
          400,
          `Bàn ${table.code || table.name} đang được sử dụng bởi khách khác`,
        );
      }

      // Create active TableSession
      let session = await TableSession.findOne({
        reservationId: reservation._id,
        status: "active",
      });
      if (!session) {
        session = await TableSession.create({
          tableId: reservation.assignedTableId,
          reservationId: reservation._id,
          createdBy: req.user.id,
          customerName: reservation.customerName,
          guestCount: reservation.guestCount,
          status: "active",
        });
      }

      // Update table status to occupied
      table.status = "occupied";
      await table.save();
    } else if (newStatus === "cancelled" || newStatus === "no_show") {
      // Release table if it was reserved
      if (reservation.assignedTableId) {
        const table = await Table.findById(reservation.assignedTableId);
        if (
          table &&
          (table.status === "reserved" || table.status === "occupied")
        ) {
          // Check if there is any other active session on this table before freeing it
          const otherSession = await TableSession.findOne({
            tableId: table._id,
            status: "active",
            reservationId: { $ne: reservation._id },
          });
          if (!otherSession) {
            table.status = "available";
            await table.save();
          }
        }
      }

      // Cancel associated active session if exists
      const session = await TableSession.findOne({
        reservationId: reservation._id,
        status: "active",
      });
      if (session) {
        session.status = "cancelled";
        session.endedAt = new Date();
        await session.save();
      }
    }
  }

  // If table is changed during update
  if (
    updates.assignedTableId !== undefined &&
    String(updates.assignedTableId) !== String(oldTableId)
  ) {
    // If it was reserved or checked in, free the old table
    if (
      oldTableId &&
      (reservation.status === "confirmed" ||
        reservation.status === "checked_in")
    ) {
      const oldTable = await Table.findById(oldTableId);
      if (oldTable) {
        // Only free if no other active sessions are on it
        const otherSession = await TableSession.findOne({
          tableId: oldTable._id,
          status: "active",
          reservationId: { $ne: reservation._id },
        });
        if (!otherSession) {
          oldTable.status = "available";
          await oldTable.save();
        }
      }
    }

    // Set status on the new table
    if (updates.assignedTableId) {
      const newTable = await Table.findById(updates.assignedTableId);
      if (newTable) {
        if (reservation.status === "confirmed") {
          newTable.status = "reserved";
          await newTable.save();
        } else if (reservation.status === "checked_in") {
          newTable.status = "occupied";
          await newTable.save();
          // Update active session table ID
          await TableSession.findOneAndUpdate(
            { reservationId: reservation._id, status: "active" },
            { tableId: updates.assignedTableId },
          );
        }
      }
    }
  }

  await reservation.save();

  const populated = await Reservation.findById(reservation._id).populate(
    "assignedTableId",
    "code name capacity",
  );

  res
    .status(200)
    .json(
      createResponse(true, 200, "Reservation updated successfully", populated),
    );
});

export const deleteReservation = handleAsync(async (req, res) => {
  const reservation = await Reservation.findByIdAndDelete(req.params.id);
  if (!reservation) {
    return res
      .status(404)
      .json(createResponse(false, 404, "Reservation not found"));
  }
  res
    .status(200)
    .json(createResponse(true, 200, "Reservation deleted successfully"));
});
