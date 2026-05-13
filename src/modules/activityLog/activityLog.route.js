import { Router } from "express";
import validBodyRequest from "../../common/utils/validBodyRequest.js";
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
  validBodyRequest(activityLogCreateSchema),
  createActivityLog,
);
activityLogRouter.get("/", getActivityLogs);
activityLogRouter.get("/:id", getActivityLogDetail);
activityLogRouter.patch(
  "/:id",
  validBodyRequest(activityLogUpdateSchema),
  updateActivityLog,
);
activityLogRouter.delete("/:id", deleteActivityLog);

export default activityLogRouter;
