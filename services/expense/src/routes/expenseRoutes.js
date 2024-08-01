import express from "express";
import {
	addExpenseController,
	deleteExpensesController,
	getExpensesController,
} from "../controllers/expenseController.js";
import { authMiddleware } from "@expensio/sharedlib";

const router = express.Router();

//@public

//@private
router.get("/", authMiddleware, getExpensesController);
router.post("/", authMiddleware, addExpenseController);
router.delete("/", authMiddleware, deleteExpensesController);

export default router;
