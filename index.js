import express from "express";
import cors from "cors";
import router from "./src/routes/index.js";
import jsonValidator from "./src/common/middlewares/jsonValidator.js";
import notFoundHandler from "./src/common/middlewares/notfoundHandler.js";
import errorHandler from "./src/common/middlewares/errorHandler.js";
import { configenv } from "./src/common/configs/configenv.js";
import { connectDB } from "./src/common/configs/connectDB.js";

const app = express();

app.use(
  cors({
    origin: configenv.CLIENT_URL,
    credentials: true,
  })
);

await connectDB();
app.use(express.json());
app.use(jsonValidator);
app.use("/api", router);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(configenv.PORT, () => {
  console.log(
    `Ứng dụng của bạn đang được khởi động trên cổng ${configenv.PORT}`
  );
});
