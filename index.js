import express from "express";
import cors from "cors";
import router from "./src/routes/index.js";
import connectDB from "./src/common/configs/connectDB.js";
import jsonValidator from "./src/common/middlewares/jsonValidator.js";
import notFoundHandler from "./src/common/middlewares/notfoundHandler.js";
import errorHandler from "./src/common/middlewares/errorHandler.js";
import { configenv } from "./src/common/configs/configenv.js";

const app = express();

app.use(
  cors({
    origin: configenv.CLIENT_URL,
    credentials: true,
  }),
);
app.use(express.json());

app.use("/api", router);

app.use(jsonValidator);
app.use(notFoundHandler);
app.use(errorHandler);

async function startServer() {
  if (!configenv.JWT_SECRET) {
    console.error("JWT_SECRET chưa được cấu hình trong .env");
    process.exit(1);
  }

  try {
    await connectDB();
    app.listen(configenv.PORT, () => {
      console.log(
        `Ứng dụng của bạn đang được khởi động trên cổng ${configenv.PORT}`,
      );
    });
  } catch {
    console.error(
      "Không thể kết nối MongoDB. Kiểm tra MONGODB_URI trong Node/.env và kết nối mạng.",
    );
    process.exit(1);
  }
}

startServer();
