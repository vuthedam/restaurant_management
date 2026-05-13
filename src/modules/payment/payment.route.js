import { Router } from "express";
import validBodyRequest from "../../common/utils/validBodyRequest.js";
import { paymentCreateSchema, paymentUpdateSchema } from "./payment.schema.js";
import {
  createPayment,
  deletePayment,
  getPaymentDetail,
  getPayments,
  updatePayment,
} from "./payment.controller.js";

const paymentRouter = Router();

paymentRouter.post("/", validBodyRequest(paymentCreateSchema), createPayment);
paymentRouter.get("/", getPayments);
paymentRouter.get("/:id", getPaymentDetail);
paymentRouter.patch("/:id", validBodyRequest(paymentUpdateSchema), updatePayment);
paymentRouter.delete("/:id", deletePayment);

export default paymentRouter;
