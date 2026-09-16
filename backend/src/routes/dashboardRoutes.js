import express from "express";
import { getDashboardSummary } from "../controller/dashboardController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const dashboardRouter = express.Router();

// GET /dashboard/summary
dashboardRouter.get("/summary", authenticateToken, getDashboardSummary);

export default dashboardRouter;
