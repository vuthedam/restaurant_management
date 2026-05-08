import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
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

    paidBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    paymentCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    method: {
      type: String,
      enum: ["cash", "banking", "momo", "vnpay", "pos"],
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },

    paidAt: {
      type: Date,
      default: null,
    },

    transactionId: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

paymentSchema.index({ paymentCode: 1 });
paymentSchema.index({ tableSessionId: 1 });
paymentSchema.index({ orderId: 1 });
paymentSchema.index({ paidBy: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ createdAt: -1 });

export default mongoose.model("Payment", paymentSchema);
