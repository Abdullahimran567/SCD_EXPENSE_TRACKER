import express from "express";
import {
	createTransaction,
	getTransactions,
	updateTransaction,
	deleteTransaction,
} from "../controller/transactionController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const transactionRouter = express.Router();

transactionRouter.use(authenticateToken);

// POST /transactions
transactionRouter.post("/", createTransaction);

// GET /transactions
transactionRouter.get("/", getTransactions);

// PUT /transactions/:id
transactionRouter.put("/:id", updateTransaction);

// DELETE /transactions/:id
transactionRouter.delete("/:id", deleteTransaction);

export default transactionRouter;
