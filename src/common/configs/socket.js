import { Server } from "socket.io";
import { configenv } from "./configenv.js";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: [configenv.CLIENT_URL, "http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:5173", "http://127.0.0.1:5174"],
      methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    console.log(`Socket client connected: ${socket.id}`);
    
    socket.on("disconnect", () => {
      console.log(`Socket client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io is not initialized!");
  }
  return io;
};
