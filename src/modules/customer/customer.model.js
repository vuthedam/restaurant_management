import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 9,
      maxlength: 15,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: null,
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

customerSchema.index({ fullName: "text", phone: "text" });

export default mongoose.model("Customer", customerSchema);
