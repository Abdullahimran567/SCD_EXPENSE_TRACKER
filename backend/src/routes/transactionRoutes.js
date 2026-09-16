import express from "express";
import { createTransaction, getTransactions } from "../controller/transactionController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const transactionRouter = express.Router();

transactionRouter.use(authenticateToken);

// POST /transactions
transactionRouter.post("/", createTransaction);

// GET /transactions
transactionRouter.get("/", getTransactions);

export default transactionRouter;
