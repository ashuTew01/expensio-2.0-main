import express from "express";
import {
	// addCategoriesController,
	// addCognitiveTriggersController,
	addExpensesController,
	deleteExpensesController,
	getExpensesController,
	// removeCategoriesController,
	// removeCognitiveTriggersController,
	getCategoriesByIdsController,
	getCognitiveTriggersByIdsController,
	getCognitiveTriggersController,
	getAllCategoriesController
} from "../controllers/expenseController.js";
import { authMiddleware } from "@expensio/sharedlib";

const router = express.Router();

//@public
router.post("/category/get", getCategoriesByIdsController);
router.post("/cognitive-trigger/get", getCognitiveTriggersByIdsController);
router.get("/cognitive/all", getCognitiveTriggersController);
router.get("/category/all", getAllCategoriesController);

//@private
router.get("/", authMiddleware, getExpensesController);
router.post("/", authMiddleware, addExpensesController);
router.delete("/", authMiddleware, deleteExpensesController);

//TEMPORARY DEVELOPMENT ROUTES
// router.post("/cognitiveTrigger", addCognitiveTriggersController);
// router.delete("/cognitiveTrigger", removeCognitiveTriggersController);

// router.post("/category", addCategoriesController);
// router.delete("/category", removeCategoriesController);

export default router;
