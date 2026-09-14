import express from "express";
import { login, signup, logout, getMe } from "../controller/authController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const authRouter = express.Router();

// Signup Route
authRouter.post("/signup", signup);

// Login Route
authRouter.post("/login", login);

// Logout Route
authRouter.post("/logout", logout);

// Profile / Current User Route
authRouter.get("/me", authenticateToken, getMe);

export default authRouter;
