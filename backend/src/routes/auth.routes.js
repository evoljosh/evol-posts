// src/routes/auth.routes.js
// Routes for signup and login

import express from "express";
import { signup, login } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

export default router;
