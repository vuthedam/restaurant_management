import { Router } from "express";
import validBodyRequest from "../../common/utils/validBodyRequest.js";
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

customerRouter.post("/", validBodyRequest(customerCreateSchema), createCustomer);
customerRouter.get("/", getCustomers);
customerRouter.get("/:id", getCustomerDetail);
customerRouter.patch(
  "/:id",
  validBodyRequest(customerUpdateSchema),
  updateCustomer,
);
customerRouter.delete("/:id", deleteCustomer);

export default customerRouter;
