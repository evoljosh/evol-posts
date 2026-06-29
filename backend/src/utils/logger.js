// src/utils/logger.js
// A very simple logger middleware — logs every request to the console

const logger = (req, res, next) => {
  const time = new Date().toISOString();
  console.log(`[${time}] ${req.method} ${req.originalUrl}`);
  next();
};

export default logger;
