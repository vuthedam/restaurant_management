import { Router } from "express";
import validBodyRequest from "../../common/utils/validBodyRequest.js";
import { requireAdmin } from "../../common/middlewares/guards.js";
import {
  categoryCreateSchema,
  categoryUpdateSchema,
} from "./category.schema.js";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryDetail,
  updateCategory,
} from "./category.controller.js";

const categoryRouter = Router();

categoryRouter.get("/", getCategories);
categoryRouter.get("/:id", getCategoryDetail);
categoryRouter.post("/", ...requireAdmin, validBodyRequest(categoryCreateSchema), createCategory);
categoryRouter.patch(
  "/:id",
  ...requireAdmin,
  validBodyRequest(categoryUpdateSchema),
  updateCategory,
);
categoryRouter.delete("/:id", ...requireAdmin, deleteCategory);

export default categoryRouter;
