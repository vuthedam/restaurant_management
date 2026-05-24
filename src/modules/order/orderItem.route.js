import { Router } from "express";
import validBodyRequest from "../../common/utils/validBodyRequest.js";
import { requireAdmin, requireStaff } from "../../common/middlewares/guards.js";
import {
  orderItemCreateSchema,
  orderItemUpdateSchema,
} from "./orderItem.schema.js";
import {
  createOrderItem,
  deleteOrderItem,
  getOrderItemDetail,
  getOrderItems,
  updateOrderItem,
} from "./orderItem.controller.js";

const orderItemRouter = Router();

orderItemRouter.post(
  "/",
  ...requireStaff,
  validBodyRequest(orderItemCreateSchema),
  createOrderItem,
);
orderItemRouter.get("/", ...requireStaff, getOrderItems);
orderItemRouter.get("/:id", ...requireStaff, getOrderItemDetail);
orderItemRouter.patch(
  "/:id",
  ...requireStaff,
  validBodyRequest(orderItemUpdateSchema),
  updateOrderItem,
);
orderItemRouter.delete("/:id", ...requireStaff, deleteOrderItem);

export default orderItemRouter;
