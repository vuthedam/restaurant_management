import { Router } from "express";
import validBodyRequest from "../../common/utils/validBodyRequest.js";
import { requireAdmin } from "../../common/middlewares/guards.js";
import {
  menuItemCreateSchema,
  menuItemUpdateSchema,
} from "./menu-item.schema.js";
import {
  createMenuItem,
  deleteMenuItem,
  getMenuItemDetail,
  getMenuItems,
  updateMenuItem,
} from "./menu-item.controller.js";

const menuItemRouter = Router();

menuItemRouter.get("/", getMenuItems);
menuItemRouter.get("/:id", getMenuItemDetail);
menuItemRouter.post("/", ...requireAdmin, validBodyRequest(menuItemCreateSchema), createMenuItem);
menuItemRouter.patch(
  "/:id",
  ...requireAdmin,
  validBodyRequest(menuItemUpdateSchema),
  updateMenuItem,
);
menuItemRouter.delete("/:id", ...requireAdmin, deleteMenuItem);

export default menuItemRouter;
