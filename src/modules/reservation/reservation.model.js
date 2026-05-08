import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      default: null,
    },

    assignedTableId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Table",
      default: null,
    },

    confirmedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    reservationCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    customerName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
      minlength: 9,
      maxlength: 15,
    },

    guestCount: {
      type: Number,
      required: true,
      min: 1,
      max: 30,
    },

    reservationDate: {
      type: Date,
      required: true,
    },

    reservationTime: {
      type: String,
      required: true,
      trim: true,
    },

    reservedUntil: {
      type: Date,
      default: null,
    },

    source: {
      type: String,
      enum: ["website", "phone", "walk_in", "facebook", "zalo"],
      default: "website",
    },

    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "checked_in",
        "completed",
        "cancelled",
        "no_show",
      ],
      default: "pending",
    },

    note: {
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

reservationSchema.index({ reservationCode: 1 });
reservationSchema.index({ phone: 1 });
reservationSchema.index({ reservationDate: 1, reservationTime: 1 });
reservationSchema.index({ status: 1 });
reservationSchema.index({ assignedTableId: 1 });

export default mongoose.model("Reservation", reservationSchema);
