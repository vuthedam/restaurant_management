import { Router } from "express";
import validBodyRequest from "../../common/utils/validBodyRequest.js";
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
  validBodyRequest(serviceCallCreateSchema),
  createServiceCall,
);
serviceCallRouter.get("/", getServiceCalls);
serviceCallRouter.get("/:id", getServiceCallDetail);
serviceCallRouter.patch(
  "/:id",
  validBodyRequest(serviceCallUpdateSchema),
  updateServiceCall,
);
serviceCallRouter.delete("/:id", deleteServiceCall);

export default serviceCallRouter;
