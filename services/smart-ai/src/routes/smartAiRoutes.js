import express from "express";
import { smartChatTestController } from "../controllers/smartChatController.js";
import { callAiController } from "../controllers/aiContoller.js";
import { authMiddleware } from "@expensio/sharedlib";

const router = express.Router();

router.get("/test", smartChatTestController);

router.post("/callAI", authMiddleware, callAiController);

export default router;
