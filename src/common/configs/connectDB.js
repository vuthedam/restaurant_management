import mongoose from "mongoose";
import { configenv } from "./configenv.js";

export async function connectDB() {
  try {
    await mongoose.connect(configenv.MONGODB_URI);
    console.log("Connect database successfully!");
  } catch (err) {
    console.error("Connect DB error:", err.message);
    throw err;
  }
}
