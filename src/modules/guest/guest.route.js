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
import { reviewCreateSchema } from "../review/review.schema.js";
import { createReview } from "../review/review.controller.js";
import { serviceCallCreateSchema } from "../serviceCall/serviceCall.schema.js";
import { createGuestServiceCall } from "../serviceCall/serviceCall.controller.js";

const guestRouter = Router();

guestRouter.get("/menu", getPublicMenu);
guestRouter.get("/tables/:qrToken", getTableByQr);
guestRouter.post("/orders", validBodyRequest(guestPlaceOrderSchema), placeGuestOrder);
guestRouter.post("/reservations", validBodyRequest(guestReservationSchema), placeGuestReservation);
guestRouter.patch("/order-items/:id/cancel", cancelPendingOrderItem);
guestRouter.post("/reviews", validBodyRequest(reviewCreateSchema), createReview);
guestRouter.post("/service-calls", validBodyRequest(serviceCallCreateSchema), createGuestServiceCall);

export default guestRouter;
