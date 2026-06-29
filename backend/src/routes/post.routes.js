// src/routes/post.routes.js
// Routes for post CRUD operations

import express from "express";
import {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} from "../controllers/post.controller.js";
import protect from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public routes — anyone can view posts
router.get("/", getAllPosts);
router.get("/:id", getPostById);

// Protected routes — must be logged in (token required)
router.post("/", protect, createPost);
router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);

export default router;
