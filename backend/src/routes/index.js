import express from "express";
import generalrouter from "./generalRoutes.js";
import authRouter from "./authRoutes.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/", authRouter);
router.use("/", generalrouter);

export default router;
