import createResponse from "../../common/utils/createResponse.js";
import handleAsync from "../../common/utils/handleAsync.js";
import Review from "./review.model.js";

export const createReview = handleAsync(async (req, res) => {
  const review = await Review.create(req.body);
  res.status(201).json(createResponse(true, 201, "Review created successfully", review));
});

export const getReviews = handleAsync(async (req, res) => {
  const reviews = await Review.find();
  res
    .status(200)
    .json(createResponse(true, 200, "Reviews retrieved successfully", reviews));
});

export const getReviewDetail = handleAsync(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    return res.status(404).json(createResponse(false, 404, "Review not found"));
  }
  res.status(200).json(createResponse(true, 200, "Review retrieved successfully", review));
});

export const updateReview = handleAsync(async (req, res) => {
  const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json(createResponse(true, 200, "Review updated successfully", review));
});

export const deleteReview = handleAsync(async (req, res) => {
  await Review.findByIdAndDelete(req.params.id);
  res.status(200).json(createResponse(true, 200, "Review deleted successfully"));
});
