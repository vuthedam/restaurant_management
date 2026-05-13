import createResponse from "../../common/utils/createResponse.js";
import handleAsync from "../../common/utils/handleAsync.js";
import Reservation from "./reservation.model.js";

export const createReservation = handleAsync(async (req, res) => {
  const reservation = await Reservation.create(req.body);
  res
    .status(201)
    .json(createResponse(true, 201, "Reservation created successfully", reservation));
});

export const getReservations = handleAsync(async (req, res) => {
  const reservations = await Reservation.find();
  res
    .status(200)
    .json(
      createResponse(true, 200, "Reservations retrieved successfully", reservations),
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
      createResponse(true, 200, "Reservation retrieved successfully", reservation),
    );
});

export const updateReservation = handleAsync(async (req, res) => {
  const reservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res
    .status(200)
    .json(createResponse(true, 200, "Reservation updated successfully", reservation));
});

export const deleteReservation = handleAsync(async (req, res) => {
  await Reservation.findByIdAndDelete(req.params.id);
  res
    .status(200)
    .json(createResponse(true, 200, "Reservation deleted successfully"));
});
