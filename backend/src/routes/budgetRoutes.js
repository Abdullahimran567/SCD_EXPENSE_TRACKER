import express from "express";
import { setBudget, getBudget } from "../controller/budgetController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const budgetRouter = express.Router();

budgetRouter.use(authenticateToken);

// POST /budget
budgetRouter.post("/", setBudget);

// GET /budget
budgetRouter.get("/", getBudget);

export default budgetRouter;
