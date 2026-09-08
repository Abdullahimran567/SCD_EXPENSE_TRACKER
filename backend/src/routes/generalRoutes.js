import express from "express";
import { sayHI } from "../controller/generalController.js";

const generalrouter = express.Router();

generalrouter.get("/", sayHI);

export default generalrouter;
