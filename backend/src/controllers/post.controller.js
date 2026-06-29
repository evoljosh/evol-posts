// src/controllers/post.controller.js
// Handles all CRUD operations for posts

import Post from "../models/post.model.js";

// GET /api/posts — anyone can view all posts
export const getAllPosts = async (req, res, next) => {
  try {
    // Newest posts first
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};

// GET /api/posts/:id — view a single post
export const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

// POST /api/posts — only logged-in users can create a post
export const createPost = async (req, res, next) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const newPost = await Post.create({
      title,
      content,
      author: req.user.id, // comes from the auth middleware (decoded token)
      authorName: req.user.username,
    });

    res.status(201).json(newPost);
  } catch (error) {
    next(error);
  }
};

// PUT /api/posts/:id — only the post's owner can edit it
export const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Security check: make sure the logged-in user owns this post
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only edit your own posts" });
    }

    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;
    await post.save();

    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/posts/:id — only the post's owner can delete it
export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only delete your own posts" });
    }

    await post.deleteOne();
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    next(error);
  }
};
