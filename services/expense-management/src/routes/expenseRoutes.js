import express from "express";
import { getExpenses } from "../controllers/expenseController.js";

const router = express.Router();

router.get("/", getExpenses);

export default router;
