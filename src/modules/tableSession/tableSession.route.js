import { Router } from "express";
import validBodyRequest from "../../common/utils/validBodyRequest.js";
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
} from "./tableSession.controller.js";

const tableSessionRouter = Router();

tableSessionRouter.post(
  "/",
  validBodyRequest(tableSessionCreateSchema),
  createTableSession,
);
tableSessionRouter.get("/", getTableSessions);
tableSessionRouter.get("/:id", getTableSessionDetail);
tableSessionRouter.patch(
  "/:id",
  validBodyRequest(tableSessionUpdateSchema),
  updateTableSession,
);
tableSessionRouter.delete("/:id", deleteTableSession);

export default tableSessionRouter;
