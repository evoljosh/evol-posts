// src/index.js
// Sets up the Express app: middleware, routes, error handling

import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import postRoutes from "./routes/post.routes.js";
import logger from "./utils/logger.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();

// ===== Global Middleware =====
app.use(cors());            // allow frontend (different origin) to call this API
app.use(express.json());    // parse incoming JSON request bodies
app.use(logger);            // log every incoming request

// ===== Routes =====
app.get("/", (req, res) => {
  res.json({ message: "EVOL Posts API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

// ===== 404 handler for unknown routes =====
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ===== Global error handler (must be last) =====
app.use(errorHandler);

export default app;
