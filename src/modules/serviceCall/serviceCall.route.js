import { Router } from "express";
import validBodyRequest from "../../common/utils/validBodyRequest.js";
import { requireAdmin, requireStaff } from "../../common/middlewares/guards.js";
import {
  serviceCallCreateSchema,
  serviceCallUpdateSchema,
} from "./serviceCall.schema.js";
import {
  createServiceCall,
  deleteServiceCall,
  getServiceCallDetail,
  getServiceCalls,
  updateServiceCall,
} from "./serviceCall.controller.js";

const serviceCallRouter = Router();

serviceCallRouter.post(
  "/",
  ...requireStaff,
  validBodyRequest(serviceCallCreateSchema),
  createServiceCall,
);
serviceCallRouter.get("/", ...requireStaff, getServiceCalls);
serviceCallRouter.get("/:id", ...requireStaff, getServiceCallDetail);
serviceCallRouter.patch(
  "/:id",
  ...requireStaff,
  validBodyRequest(serviceCallUpdateSchema),
  updateServiceCall,
);
serviceCallRouter.delete("/:id", ...requireAdmin, deleteServiceCall);

export default serviceCallRouter;
