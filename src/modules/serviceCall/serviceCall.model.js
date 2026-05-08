import mongoose from "mongoose";

const serviceCallSchema = new mongoose.Schema(
  {
    tableId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Table",
      required: true,
    },

    tableSessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TableSession",
      default: null,
    },

    handledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    type: {
      type: String,
      enum: [
        "call_staff",
        "request_payment",
        "need_water",
        "clean_table",
        "other",
      ],
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "handling", "completed", "cancelled"],
      default: "pending",
    },

    note: {
      type: String,
      trim: true,
      maxlength: 300,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

serviceCallSchema.index({ tableId: 1 });
serviceCallSchema.index({ tableSessionId: 1 });
serviceCallSchema.index({ handledBy: 1 });
serviceCallSchema.index({ status: 1 });
serviceCallSchema.index({ createdAt: -1 });

export default mongoose.model("ServiceCall", serviceCallSchema);
