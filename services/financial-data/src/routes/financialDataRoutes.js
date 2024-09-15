import express from "express";
import {
	getExpenseFinancialDataController,
	getIncomeFinancialDataController,
} from "../controllers/financialDataController.js";
import { authMiddleware } from "@expensio/sharedlib";
import {
	buildFinancialSummaryController,
	getFinancialSummaryController,
} from "../controllers/financialSummaryController.js";

const router = express.Router();

router.post("/expense", authMiddleware, getExpenseFinancialDataController);
router.post("/income", authMiddleware, getIncomeFinancialDataController);

router.get("/summary", authMiddleware, getFinancialSummaryController);
router.post("/summary/build", authMiddleware, buildFinancialSummaryController);

export default router;
