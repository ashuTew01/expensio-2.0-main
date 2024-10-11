import express from "express";
import { smartChatTestController } from "../controllers/smartChatController.js";
import {
	callAiController,
	getUserAiTokensDetailsController,
	resetGuestAiTokensController,
} from "../controllers/aiContoller.js";
import { authMiddleware } from "@expensio/sharedlib";
import guestResetMiddleware from "../middlewares/guestResetMiddleware.js";

const router = express.Router();

router.get("/test", smartChatTestController);

router.post("/callAI", authMiddleware, callAiController);
router.get(
	"/user/ai-tokens-detail",
	authMiddleware,
	getUserAiTokensDetailsController
);

//guest reset
router.post(
	"/guest/token-reset",
	guestResetMiddleware,
	resetGuestAiTokensController
);

export default router;
