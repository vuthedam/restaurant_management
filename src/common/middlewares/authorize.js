import createError from "../utils/createError.js";

const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user?.role)) {
    return next(createError(403, "Bạn không có quyền thực hiện hành động này"));
  }
  next();
};

export default authorize;
