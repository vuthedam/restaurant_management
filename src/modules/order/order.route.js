import { Router } from "express";
import validBodyRequest from "../../common/utils/validBodyRequest.js";
import { orderCreateSchema, orderUpdateSchema } from "./order.schema.js";
import {
  createOrder,
  deleteOrder,
  getOrderDetail,
  getOrders,
  updateOrder,
} from "./order.controller.js";

const orderRouter = Router();

orderRouter.post("/", validBodyRequest(orderCreateSchema), createOrder);
orderRouter.get("/", getOrders);
orderRouter.get("/:id", getOrderDetail);
orderRouter.patch("/:id", validBodyRequest(orderUpdateSchema), updateOrder);
orderRouter.delete("/:id", deleteOrder);

export default orderRouter;
