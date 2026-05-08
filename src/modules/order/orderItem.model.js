import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    menuItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MenuItem",
      required: true,
    },

    servedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    image: {
      type: String,
      default: null,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
      max: 100,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    note: {
      type: String,
      trim: true,
      maxlength: 300,
      default: null,
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "preparing", "served", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

orderItemSchema.index({ orderId: 1 });
orderItemSchema.index({ menuItemId: 1 });
orderItemSchema.index({ servedBy: 1 });
orderItemSchema.index({ status: 1 });

export default mongoose.model("OrderItem", orderItemSchema);
