import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    action: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    entityType: {
      type: String,
      required: true,
      enum: [
        "user",
        "customer",
        "table",
        "category",
        "menu_item",
        "reservation",
        "table_session",
        "order",
        "order_item",
        "payment",
        "service_call",
        "review",
      ],
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

activityLogSchema.index({ userId: 1 });
activityLogSchema.index({ entityId: 1 });
activityLogSchema.index({ entityType: 1 });
activityLogSchema.index({ action: 1 });
activityLogSchema.index({ createdAt: -1 });

export default mongoose.model("ActivityLog", activityLogSchema);
