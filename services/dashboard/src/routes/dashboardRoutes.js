import express from "express";
import { getDashboardController } from "../controllers/dashboardController.js";
import { authMiddleware } from "@expensio/sharedlib";

const router = express.Router();

router.get("/", authMiddleware, getDashboardController);

export default router;
