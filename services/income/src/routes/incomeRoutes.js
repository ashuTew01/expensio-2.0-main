import express from "express";
import { authMiddleware } from "@expensio/sharedlib";
import {
	addCategoriesController,
	removeCategoriesController,
	addIncomesController,
	deleteIncomesController,
	getIncomesController,
} from "../controllers/incomeController.js";

const router = express.Router();

//@public

//@private
router.get("/", authMiddleware, getIncomesController);
router.post("/", authMiddleware, addIncomesController);
router.delete("/", authMiddleware, deleteIncomesController);

//TEMPORARY DEVELOPMENT ROUTES

router.post("/category", addCategoriesController);
router.delete("/category", removeCategoriesController);

export default router;
