import { Router } from "express";
import validBodyRequest from "../../common/utils/validBodyRequest.js";
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

categoryRouter.post("/", validBodyRequest(categoryCreateSchema), createCategory);
categoryRouter.get("/", getCategories);
categoryRouter.get("/:id", getCategoryDetail);
categoryRouter.patch(
  "/:id",
  validBodyRequest(categoryUpdateSchema),
  updateCategory,
);
categoryRouter.delete("/:id", deleteCategory);

export default categoryRouter;
