import express from "express";
import { authMiddleware } from "@expensio/sharedlib";

const router = express.Router();

// router.get("/", authMiddleware, getDashboardController);

export default router;
