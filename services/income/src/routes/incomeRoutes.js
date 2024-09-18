import express from "express";
import {
	addCategoriesController,
	addIncomesController,
	deleteIncomesController,
	getIncomesController,
	// removeCategoriesController,
	getCategoriesByIdsController,
	getAllCategoriesController,
} from "../controllers/incomeController.js";
import { authMiddleware } from "@expensio/sharedlib";

const router = express.Router();

//@public
router.post("/category/get", getCategoriesByIdsController);
router.get("/category/all", getAllCategoriesController);

//@private
router.get("/", authMiddleware, getIncomesController);
router.post("/", authMiddleware, addIncomesController);
router.delete("/", authMiddleware, deleteIncomesController);

//TEMPORARY DEVELOPMENT ROUTES

// router.post("/category", addCategoriesController);
// router.delete("/category", removeCategoriesController);

export default router;
