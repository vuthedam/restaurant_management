import createResponse from "../../common/utils/createResponse.js";
import handleAsync from "../../common/utils/handleAsync.js";
import createError from "../../common/utils/createError.js";
import Review from "./review.model.js";
import TableSession from "../tableSession/tableSession.model.js";

export const createReview = handleAsync(async (req, res) => {
  const table_session_id = req.body.table_session_id || req.body.tableSessionId;
  const order_id = req.body.order_id || req.body.orderId;
  const food_rating = req.body.food_rating !== undefined ? req.body.food_rating : req.body.foodRating;
  const service_rating = req.body.service_rating !== undefined ? req.body.service_rating : req.body.serviceRating;
  const ambiance_rating = req.body.ambiance_rating !== undefined ? req.body.ambiance_rating : req.body.ambianceRating;
  const comment = req.body.comment;

  if (!table_session_id) {
    throw createError(400, "Phiên bàn không được để trống.");
  }

  // Check if TableSession exists
  const session = await TableSession.findById(table_session_id);
  if (!session) {
    throw createError(404, "Phiên bàn không tồn tại.");
  }

  // Check if TableSession status is "paid"
  if (session.status !== "paid") {
    throw createError(400, "Chỉ có thể đánh giá sau khi hoàn tất thanh toán.");
  }

  // Check if a review already exists for this tableSessionId
  const existingReview = await Review.findOne({
    $or: [{ table_session_id }, { tableSessionId: table_session_id }],
  });
  if (existingReview) {
    throw createError(400, "Phiên bàn này đã được đánh giá.");
  }

  // Calculate average rating
  const rating = (Number(food_rating) + Number(service_rating) + Number(ambiance_rating)) / 3;

  // Create review saving both formats for compatibility
  const review = await Review.create({
    table_session_id,
    tableSessionId: table_session_id,
    order_id: order_id || null,
    orderId: order_id || null,
    food_rating,
    foodRating: food_rating,
    service_rating,
    serviceRating: service_rating,
    ambiance_rating,
    ambianceRating: ambiance_rating,
    rating,
    comment: comment || null,
  });

  res
    .status(201)
    .json(createResponse(true, 201, "Review created successfully", review));
});

export const getReviews = handleAsync(async (req, res) => {
  let reviews = await Review.find()
    .populate({
      path: "table_session_id",
      populate: {
        path: "tableId",
        select: "name code",
      },
    })
    .populate({
      path: "tableSessionId",
      populate: {
        path: "tableId",
        select: "name code",
      },
    })
    .sort({ createdAt: -1 });

  const { search, tableId } = req.query;

  // Filter in memory for easy search & filter on populated data
  if (search) {
    const searchLower = search.toLowerCase();
    reviews = reviews.filter((r) => {
      const session = r.table_session_id || r.tableSessionId;
      return session?.customerName?.toLowerCase().includes(searchLower);
    });
  }

  if (tableId) {
    reviews = reviews.filter((r) => {
      const session = r.table_session_id || r.tableSessionId;
      return String(session?.tableId?._id || session?.tableId) === String(tableId);
    });
  }

  res
    .status(200)
    .json(createResponse(true, 200, "Reviews retrieved successfully", reviews));
});

export const checkReviewStatus = handleAsync(async (req, res) => {
  const { tableSessionId } = req.params;

  const session = await TableSession.findById(tableSessionId);
  if (!session) {
    return res
      .status(404)
      .json(createResponse(false, 404, "Phiên bàn không tồn tại."));
  }

  if (session.status !== "paid") {
    return res.status(200).json(
      createResponse(true, 200, "OK", {
        canReview: false,
        reason: "unpaid",
        message: "Chỉ có thể đánh giá sau khi hoàn tất thanh toán.",
      })
    );
  }

  const existingReview = await Review.findOne({
    $or: [{ table_session_id: tableSessionId }, { tableSessionId }],
  });

  if (existingReview) {
    return res.status(200).json(
      createResponse(true, 200, "OK", {
        canReview: false,
        reason: "reviewed",
        message: "Cảm ơn quý khách. Phiên bàn này đã được đánh giá.",
      })
    );
  }

  res.status(200).json(
    createResponse(true, 200, "OK", {
      canReview: true,
      session: {
        customerName: session.customerName,
        guestCount: session.guestCount,
      },
      message: "Hợp lệ",
    })
  );
});

export const getReviewDetail = handleAsync(async (req, res) => {
  const review = await Review.findById(req.params.id)
    .populate({
      path: "table_session_id",
      populate: {
        path: "tableId",
        select: "name code",
      },
    })
    .populate({
      path: "tableSessionId",
      populate: {
        path: "tableId",
        select: "name code",
      },
    });

  if (!review) {
    return res.status(404).json(createResponse(false, 404, "Review not found"));
  }
  res
    .status(200)
    .json(createResponse(true, 200, "Review retrieved successfully", review));
});

export const updateReview = handleAsync(async (req, res) => {
  const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!review) {
    return res.status(404).json(createResponse(false, 404, "Review not found"));
  }
  res
    .status(200)
    .json(createResponse(true, 200, "Review updated successfully", review));
});

export const deleteReview = handleAsync(async (req, res) => {
  const review = await Review.findByIdAndDelete(req.params.id);
  if (!review) {
    return res.status(404).json(createResponse(false, 404, "Review not found"));
  }
  res
    .status(200)
    .json(createResponse(true, 200, "Review deleted successfully"));
});
