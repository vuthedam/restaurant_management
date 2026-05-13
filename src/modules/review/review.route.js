import { Router } from "express";
import validBodyRequest from "../../common/utils/validBodyRequest.js";
import { reviewCreateSchema, reviewUpdateSchema } from "./review.schema.js";
import {
  createReview,
  deleteReview,
  getReviewDetail,
  getReviews,
  updateReview,
} from "./review.controller.js";

const reviewRouter = Router();

reviewRouter.post("/", validBodyRequest(reviewCreateSchema), createReview);
reviewRouter.get("/", getReviews);
reviewRouter.get("/:id", getReviewDetail);
reviewRouter.patch("/:id", validBodyRequest(reviewUpdateSchema), updateReview);
reviewRouter.delete("/:id", deleteReview);

export default reviewRouter;
