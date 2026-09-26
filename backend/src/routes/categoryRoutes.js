import express from "express";
import { createCategory, getCategories } from "../controller/categoryController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const categoryRouter = express.Router();

categoryRouter.use(authenticateToken);

// POST /categories
categoryRouter.post("/", createCategory);

// GET /categories
categoryRouter.get("/", getCategories);

export default categoryRouter;
