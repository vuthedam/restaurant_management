import { Router } from "express";
import validBodyRequest from "../../common/utils/validBodyRequest.js";
import { tableCreateSchema, tableUpdateSchema } from "./table.schema.js";
import {
  createTable,
  deleteTable,
  getTableDetail,
  getTables,
  updateTable,
} from "./table.controller.js";

const tableRouter = Router();

tableRouter.post("/", validBodyRequest(tableCreateSchema), createTable);
tableRouter.get("/", getTables);
tableRouter.get("/:id", getTableDetail);
tableRouter.patch("/:id", validBodyRequest(tableUpdateSchema), updateTable);
tableRouter.delete("/:id", deleteTable);

export default tableRouter;
