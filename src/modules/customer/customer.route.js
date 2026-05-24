import { Router } from "express";
import validBodyRequest from "../../common/utils/validBodyRequest.js";
import { requireAdmin } from "../../common/middlewares/guards.js";
import {
  customerCreateSchema,
  customerUpdateSchema,
} from "./customer.schema.js";
import {
  createCustomer,
  deleteCustomer,
  getCustomerDetail,
  getCustomers,
  updateCustomer,
} from "./customer.controller.js";

const customerRouter = Router();

customerRouter.post("/", ...requireAdmin, validBodyRequest(customerCreateSchema), createCustomer);
customerRouter.get("/", ...requireAdmin, getCustomers);
customerRouter.get("/:id", ...requireAdmin, getCustomerDetail);
customerRouter.patch(
  "/:id",
  ...requireAdmin,
  validBodyRequest(customerUpdateSchema),
  updateCustomer,
);
customerRouter.delete("/:id", ...requireAdmin, deleteCustomer);

export default customerRouter;
