import Joi from "joi";
import { ValidationError } from "@expensio/sharedlib";

// @desc    Get user's single/multiple income(s) based on query
// @route   GET
// @access  Private
export const getIncomesController = async (req, res, next) => {};

// @desc    Create new income(s)
// @route   POST
// @access  Private
export const addIncomesController = async (req, res, next) => {};

// @desc    Deletes eincomes, receives array eincomes containing incomeIds
// @route   POST
// @access  Private
export const deleteIncomesController = async (req, res, next) => {};

// @desc    Adds Categories
// @route   POST
// @access  Private
export const addCategoriesController = async (req, res, next) => {};

// @desc    Removes Categories
// @route   POST
// @access  Private
export const removeCategoriesController = async (req, res, next) => {};
