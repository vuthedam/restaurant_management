import mongoose from "mongoose";

const tableSessionSchema = new mongoose.Schema(
  {
    tableId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Table",
      required: true,
    },

    reservationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reservation",
      default: null,
    },

    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      default: null,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    customerName: {
      type: String,
      trim: true,
      maxlength: 100,
      default: null,
    },

    guestCount: {
      type: Number,
      min: 1,
      max: 30,
      default: 1,
    },

    status: {
      type: String,
      enum: ["active", "waiting_payment", "paid", "closed", "cancelled"],
      default: "active",
    },

    startedAt: {
      type: Date,
      default: Date.now,
    },

    endedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

tableSessionSchema.index({ tableId: 1, status: 1 });
tableSessionSchema.index({ reservationId: 1 });
tableSessionSchema.index({ customerId: 1 });
tableSessionSchema.index({ createdBy: 1 });
tableSessionSchema.index({ startedAt: -1 });

export default mongoose.model("TableSession", tableSessionSchema);
