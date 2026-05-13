import { Router } from "express";
import validBodyRequest from "../../common/utils/validBodyRequest.js";
import {
  reservationCreateSchema,
  reservationUpdateSchema,
} from "./reservation.schema.js";
import {
  createReservation,
  deleteReservation,
  getReservationDetail,
  getReservations,
  updateReservation,
} from "./reservation.controller.js";

const reservationRouter = Router();

reservationRouter.post(
  "/",
  validBodyRequest(reservationCreateSchema),
  createReservation,
);
reservationRouter.get("/", getReservations);
reservationRouter.get("/:id", getReservationDetail);
reservationRouter.patch(
  "/:id",
  validBodyRequest(reservationUpdateSchema),
  updateReservation,
);
reservationRouter.delete("/:id", deleteReservation);

export default reservationRouter;
