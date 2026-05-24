import { Router } from "express";
import validBodyRequest from "../../common/utils/validBodyRequest.js";
import { tableCreateSchema, tableUpdateSchema } from "./table.schema.js";
import { requireAdmin, requireStaff } from "../../common/middlewares/guards.js";
import {
  createTable,
  deleteTable,
  getTableDetail,
  getTables,
  updateTable,
} from "./table.controller.js";

const tableRouter = Router();

tableRouter.post("/", ...requireAdmin, validBodyRequest(tableCreateSchema), createTable);
tableRouter.get("/", ...requireStaff, getTables);
tableRouter.get("/:id", ...requireStaff, getTableDetail);
tableRouter.patch("/:id", ...requireStaff, validBodyRequest(tableUpdateSchema), updateTable);
tableRouter.delete("/:id", ...requireAdmin, deleteTable);

export default tableRouter;
