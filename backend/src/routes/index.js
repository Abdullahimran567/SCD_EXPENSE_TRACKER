import express from "express";
import generalrouter from "./generalRoutes.js";
const router = express.Router();

router.use("/", generalrouter);

export default router;
