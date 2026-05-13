import { Router } from "express";
import validBodyRequest from "../../common/utils/validBodyRequest.js";
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

orderItemRouter.post("/", validBodyRequest(orderItemCreateSchema), createOrderItem);
orderItemRouter.get("/", getOrderItems);
orderItemRouter.get("/:id", getOrderItemDetail);
orderItemRouter.patch(
  "/:id",
  validBodyRequest(orderItemUpdateSchema),
  updateOrderItem,
);
orderItemRouter.delete("/:id", deleteOrderItem);

export default orderItemRouter;
