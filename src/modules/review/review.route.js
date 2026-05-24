import { Router } from "express";
import validBodyRequest from "../../common/utils/validBodyRequest.js";
import { requireAdmin } from "../../common/middlewares/guards.js";
import { reviewCreateSchema, reviewUpdateSchema } from "./review.schema.js";
import {
  createReview,
  deleteReview,
  getReviewDetail,
  getReviews,
  updateReview,
} from "./review.controller.js";

const reviewRouter = Router();

reviewRouter.post("/", ...requireAdmin, validBodyRequest(reviewCreateSchema), createReview);
reviewRouter.get("/", ...requireAdmin, getReviews);
reviewRouter.get("/:id", ...requireAdmin, getReviewDetail);
reviewRouter.patch("/:id", ...requireAdmin, validBodyRequest(reviewUpdateSchema), updateReview);
reviewRouter.delete("/:id", ...requireAdmin, deleteReview);

export default reviewRouter;
