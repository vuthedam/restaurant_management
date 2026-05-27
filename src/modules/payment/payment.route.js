import { Router } from "express";
import validBodyRequest from "../../common/utils/validBodyRequest.js";
import { requireAdmin, requireStaff } from "../../common/middlewares/guards.js";
import {
  paymentConfirmSchema,
  paymentCreateSchema,
  paymentUpdateSchema,
} from "./payment.schema.js";
import {
  createPayment,
  confirmPayment,
  deletePayment,
  getPaymentDetail,
  getPayments,
  updatePayment,
} from "./payment.controller.js";

const paymentRouter = Router();

paymentRouter.get("/", ...requireStaff, getPayments);
paymentRouter.get("/:id", ...requireStaff, getPaymentDetail);
paymentRouter.post("/", ...requireStaff, validBodyRequest(paymentCreateSchema), createPayment);
paymentRouter.post(
  "/:id/confirm",
  ...requireStaff,
  validBodyRequest(paymentConfirmSchema),
  confirmPayment,
);
paymentRouter.patch("/:id", ...requireAdmin, validBodyRequest(paymentUpdateSchema), updatePayment);
paymentRouter.delete("/:id", ...requireAdmin, deletePayment);

export default paymentRouter;
