import { Router } from "express";
import validBodyRequest from "../../common/utils/validBodyRequest.js";
import { requireAdmin } from "../../common/middlewares/guards.js";
import {
  activityLogCreateSchema,
  activityLogUpdateSchema,
} from "./activityLog.schema.js";
import {
  createActivityLog,
  deleteActivityLog,
  getActivityLogDetail,
  getActivityLogs,
  updateActivityLog,
} from "./activityLog.controller.js";

const activityLogRouter = Router();

activityLogRouter.post(
  "/",
  ...requireAdmin,
  validBodyRequest(activityLogCreateSchema),
  createActivityLog,
);
activityLogRouter.get("/", ...requireAdmin, getActivityLogs);
activityLogRouter.get("/:id", ...requireAdmin, getActivityLogDetail);
activityLogRouter.patch(
  "/:id",
  ...requireAdmin,
  validBodyRequest(activityLogUpdateSchema),
  updateActivityLog,
);
activityLogRouter.delete("/:id", ...requireAdmin, deleteActivityLog);

export default activityLogRouter;
