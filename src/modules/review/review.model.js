import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    tableSessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TableSession",
      required: true,
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

reviewSchema.index({ tableSessionId: 1 });
reviewSchema.index({ orderId: 1 });
reviewSchema.index({ rating: 1 });

export default mongoose.model("Review", reviewSchema);
