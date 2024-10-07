import express from "express";
import { smartChatTestController } from "../controllers/smartChatController.js";
import {
	callAiController,
	getUserAiTokensDetailsController,
} from "../controllers/aiContoller.js";
import { authMiddleware } from "@expensio/sharedlib";

const router = express.Router();

router.get("/test", smartChatTestController);

router.post("/callAI", authMiddleware, callAiController);
router.get(
	"/user/ai-tokens-detail",
	authMiddleware,
	getUserAiTokensDetailsController
);

export default router;
