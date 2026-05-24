import { Router } from "express";
import validBodyRequest from "../../common/utils/validBodyRequest.js";
import { guestPlaceOrderSchema, guestReservationSchema } from "./guest.schema.js";
import {
  getPublicMenu,
  getTableByQr,
  placeGuestOrder,
  placeGuestReservation,
  cancelPendingOrderItem,
} from "./guest.controller.js";

const guestRouter = Router();

guestRouter.get("/menu", getPublicMenu);
guestRouter.get("/tables/:qrToken", getTableByQr);
guestRouter.post("/orders", validBodyRequest(guestPlaceOrderSchema), placeGuestOrder);
guestRouter.post("/reservations", validBodyRequest(guestReservationSchema), placeGuestReservation);
guestRouter.patch("/order-items/:id/cancel", cancelPendingOrderItem);

export default guestRouter;
