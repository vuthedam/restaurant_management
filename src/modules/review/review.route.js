import { Router } from "express";
import validBodyRequest from "../../common/utils/validBodyRequest.js";
import { requireAdmin } from "../../common/middlewares/guards.js";
import { reviewCreateSchema, reviewUpdateSchema } from "./review.schema.js";
import {
  createReview,
  getReviews,
  checkReviewStatus,
  getReviewDetail,
  updateReview,
  deleteReview,
} from "./review.controller.js";

const reviewRouter = Router();

// Public routes for guest reviews
reviewRouter.post("/", validBodyRequest(reviewCreateSchema), createReview);
reviewRouter.get("/check/:tableSessionId", checkReviewStatus);

// Admin protected routes
reviewRouter.get("/", ...requireAdmin, getReviews);
reviewRouter.get("/:id", ...requireAdmin, getReviewDetail);
reviewRouter.patch("/:id", ...requireAdmin, validBodyRequest(reviewUpdateSchema), updateReview);
reviewRouter.delete("/:id", ...requireAdmin, deleteReview);

export default reviewRouter;
