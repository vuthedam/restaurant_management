import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    table_session_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TableSession",
      required: true,
    },
    tableSessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TableSession",
    },

    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    food_rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    foodRating: {
      type: Number,
      min: 1,
      max: 5,
    },

    service_rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    serviceRating: {
      type: Number,
      min: 1,
      max: 5,
    },

    ambiance_rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    ambianceRating: {
      type: Number,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

reviewSchema.index({ table_session_id: 1 });
reviewSchema.index({ tableSessionId: 1 });
reviewSchema.index({ order_id: 1 });
reviewSchema.index({ orderId: 1 });
reviewSchema.index({ rating: 1 });

export default mongoose.model("Review", reviewSchema);
