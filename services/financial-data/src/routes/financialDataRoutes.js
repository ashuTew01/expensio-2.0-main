import express from "express";
import {
	getExpenseFinancialDataController,
	getIncomeFinancialDataController,
} from "../controllers/financialDataController.js";
import { authMiddleware } from "@expensio/sharedlib";

const router = express.Router();

router.post("/expense", authMiddleware, getExpenseFinancialDataController);
router.post("/income", authMiddleware, getIncomeFinancialDataController);

export default router;
