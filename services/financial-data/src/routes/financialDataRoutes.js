import express from "express";
import {
	getExpenseFinancialDataController,
	getIncomeFinancialDataController,
} from "../controllers/financialDataController.js";
import { authMiddleware } from "@expensio/sharedlib";

const router = express.Router();

router.get("/expense", authMiddleware, getExpenseFinancialDataController);
router.get("/income", authMiddleware, getIncomeFinancialDataController);

export default router;
