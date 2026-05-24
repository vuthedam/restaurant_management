import { Router } from "express";
import validBodyRequest from "../../common/utils/validBodyRequest.js";
import { staffOrderSchema, orderUpdateSchema } from "./order.schema.js";
import { requireAdmin, requireStaff } from "../../common/middlewares/guards.js";
import {
  staffCreateOrder,
  deleteOrder,
  getOrderDetail,
  getOrders,
  updateOrder,
} from "./order.controller.js";

const orderRouter = Router();

// Staff và admin đều tạo được order hộ khách
orderRouter.post("/", ...requireStaff, validBodyRequest(staffOrderSchema), staffCreateOrder);

// Admin thấy tất cả đơn, staff chỉ thấy đơn của mình (filter trong controller)
orderRouter.get("/", ...requireStaff, getOrders);
orderRouter.get("/:id", ...requireStaff, getOrderDetail);
orderRouter.patch("/:id", ...requireStaff, validBodyRequest(orderUpdateSchema), updateOrder);
orderRouter.delete("/:id", ...requireAdmin, deleteOrder);

export default orderRouter;
