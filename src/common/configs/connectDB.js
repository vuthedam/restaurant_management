import mongoose from "mongoose";
import { configenv } from "./configenv.js";
import { normalizeMongoUri } from "./normalizeMongoUri.js";

export default async function connectDB() {
  const uri = normalizeMongoUri(configenv.MONGODB_URI);

  mongoose.set("bufferCommands", false);

  try {
    await mongoose.connect(uri);
    console.log("Connect database successfully!");
  } catch (err) {
    console.error("Connect DB error:", err.message);
    throw err;
  }
}
