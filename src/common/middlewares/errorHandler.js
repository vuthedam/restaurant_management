const errorHandler = (err, req, res, next) => {
  console.error("Backend Error:", err);
  res.status(err.statusCode || 500).json({
    success: false,
    statusCode: err.statusCode || 500,
    message: err.message || "Internal Server Error",
  });
};

export default errorHandler;
