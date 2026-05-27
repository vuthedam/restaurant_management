import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

console.log("Connecting to:", process.env.MONGODB_URI);

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected successfully!");

    // Query tables
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("Collections:", collections.map(c => c.name));

    // Query tables and sessions
    const Table = mongoose.model("Table", new mongoose.Schema({}, { strict: false }));
    const TableSession = mongoose.model("TableSession", new mongoose.Schema({}, { strict: false }));
    const Payment = mongoose.model("Payment", new mongoose.Schema({}, { strict: false }));

    const tables = await Table.find({}).limit(5);
    console.log("Tables:", tables.map(t => ({ id: t._id, name: t.name, code: t.code, status: t.status })));

    const sessions = await TableSession.find({}).limit(5);
    console.log("Sessions:", sessions.map(s => ({ id: s._id, tableId: s.tableId, status: s.status })));

    const payments = await Payment.find({}).limit(5);
    console.log("Payments:", payments.map(p => ({ id: p._id, status: p.status, method: p.method, amount: p.amount })));

    await mongoose.disconnect();
    console.log("Disconnected.");
  } catch (err) {
    console.error("Error running test:", err);
  }
}

run();
