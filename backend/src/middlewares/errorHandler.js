// src/middlewares/errorHandler.js
// Catches any errors thrown in routes/controllers and sends a clean response

const errorHandler = (err, req, res, next) => {
  console.error("Error:", err.message);

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || "Something went wrong on the server",
  });
};

export default errorHandler;
