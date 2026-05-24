import { Router } from "express";
import validBodyRequest from "../../common/utils/validBodyRequest.js";
import { requireAdmin, requireStaff } from "../../common/middlewares/guards.js";
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
  ...requireStaff,
  validBodyRequest(reservationCreateSchema),
  createReservation,
);
reservationRouter.get("/", ...requireStaff, getReservations);
reservationRouter.get("/:id", ...requireStaff, getReservationDetail);
reservationRouter.patch(
  "/:id",
  ...requireStaff,
  validBodyRequest(reservationUpdateSchema),
  updateReservation,
);
reservationRouter.delete("/:id", ...requireAdmin, deleteReservation);

export default reservationRouter;
