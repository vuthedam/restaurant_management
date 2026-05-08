import jwt from "jsonwebtoken";
import { configenv } from "../configs/configenv.js";
import createError from "../utils/createError.js";

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(createError(401, "Không có quyền truy cập"));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, configenv.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return next(createError(401, "Token không hợp lệ hoặc đã hết hạn"));
  }
};

export default authenticate;
