// src/server.js
// Entry point: loads env vars, connects to DB, starts the server

import dotenv from "dotenv";
dotenv.config();

import app from "./index.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 5000;

// Connect to MongoDB first, then start listening
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
