import express from "express";
import { fetchFinancialData } from "../controllers/financialDataController.js";

const router = express.Router();

router.get("/financial-data/:userId", fetchFinancialData);

export default router;
