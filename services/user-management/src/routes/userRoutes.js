// User Routes
import express from "express";
import {
	register,
	login,
	verifyEmail,
	requestPasswordReset,
	updateProfile,
	resetPasswordController,
	getUserByEmailController,
	deleteUserController,
} from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/verify-email", verifyEmail);
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password", resetPasswordController);

//protected routes
router.get("/user/details", authMiddleware, getUserByEmailController);
router.post("/user/update-profile", authMiddleware, updateProfile);
router.delete("/user/delete", authMiddleware, deleteUserController);

export default router;
