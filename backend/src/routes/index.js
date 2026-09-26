import express from "express";
import generalrouter from "./generalRoutes.js";
import authRouter from "./authRoutes.js";
import dashboardRouter from "./dashboardRoutes.js";
import transactionRouter from "./transactionRoutes.js";
import budgetRouter from "./budgetRoutes.js";
import categoryRouter from "./categoryRoutes.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/dashboard", dashboardRouter);
router.use("/transactions", transactionRouter);
router.use("/budget", budgetRouter);
router.use("/categories", categoryRouter);
router.use("/", authRouter);
router.use("/", generalrouter);

export default router;
