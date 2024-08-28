import express from "express";
import { getFinancialDataController } from "../controllers/financialDataController.js";
import { authMiddleware } from "@expensio/sharedlib";

const router = express.Router();

router.get("/", authMiddleware, getFinancialDataController);

export default router;
