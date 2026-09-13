import express from "express";
import { login, signup } from "../controller/authController.js";

const authRouter = express.Router();

// Signup Route
authRouter.post("/signup", signup);

// Login Route
authRouter.post("/login", login);

export default authRouter;
