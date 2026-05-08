import mongoose from "mongoose";

const tableSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },

    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    qrToken: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    capacity: {
      type: Number,
      required: true,
      min: 1,
      max: 30,
    },

    status: {
      type: String,
      enum: [
        "available",
        "occupied",
        "reserved",
        "waiting_payment",
        "inactive",
      ],
      default: "available",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

tableSchema.index({ code: 1 });
tableSchema.index({ qrToken: 1 });
tableSchema.index({ status: 1 });

export default mongoose.model("Table", tableSchema);
