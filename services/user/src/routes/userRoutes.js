// User Routes
import express from "express";
import {
	sendOTPController,
	verifyOTPController,
	verifyEmailController,
	deleteUserController,
	sendVerificationEmailController,
	updateProfileController,
} from "../controllers/userController.js";
import { authMiddleware } from "@expensio/sharedlib";
const router = express.Router();
//prefix /api/user

router.post("/send-otp", sendOTPController);
router.post("/verify-otp", verifyOTPController);
router.get("/verify-email", verifyEmailController);

// protected
router.get(
	"/send-verification-email",
	authMiddleware,
	sendVerificationEmailController
);
router.delete("/user", authMiddleware, deleteUserController);
router.put("/user", authMiddleware, updateProfileController);

export default router;
