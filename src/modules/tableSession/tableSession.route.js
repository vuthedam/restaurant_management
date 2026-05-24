import { Router } from "express";
import validBodyRequest from "../../common/utils/validBodyRequest.js";
import { requireAdmin, requireStaff } from "../../common/middlewares/guards.js";
import {
  tableSessionCreateSchema,
  tableSessionUpdateSchema,
} from "./tableSession.schema.js";
import {
  createTableSession,
  deleteTableSession,
  getTableSessionDetail,
  getTableSessions,
  updateTableSession,
  transferTableSession,
} from "./tableSession.controller.js";

const tableSessionRouter = Router();

tableSessionRouter.post("/", ...requireStaff, validBodyRequest(tableSessionCreateSchema), createTableSession);
tableSessionRouter.get("/", ...requireStaff, getTableSessions);
tableSessionRouter.get("/:id", ...requireStaff, getTableSessionDetail);
tableSessionRouter.patch("/:id", ...requireStaff, validBodyRequest(tableSessionUpdateSchema), updateTableSession);
tableSessionRouter.post("/:id/transfer", ...requireStaff, transferTableSession);
tableSessionRouter.delete("/:id", ...requireAdmin, deleteTableSession);

export default tableSessionRouter;
