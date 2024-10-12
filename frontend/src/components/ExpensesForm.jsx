// src/components/ExpensesForm.jsx
import React from "react";
import {
	Box,
	Typography,
	TextField,
	Button,
	Grid,
	CircularProgress,
	useTheme,
	MenuItem,
	Select,
	FormControl,
	InputLabel,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as yup from "yup";
import {
	useSaveExpensesMutation,
	useGetAllExpenseCategoriesQuery,
} from "../state/api";
import { toast } from "react-toastify";
import { capitalizeFirstLetter } from "../utils/capitalizeFirstLetter";

const ExpensesForm = ({
	cognitiveTriggersData,
	cognitiveTriggersDataLoading,
	cognitiveTriggersDataError,
}) => {
	const moods = ["neutral", "happy", "regretful"];
	const expenseTypes = ["necessity", "luxury", "investment", "saving"];

	const theme = useTheme();

	const [saveExpenses, { isLoading, isError }] = useSaveExpensesMutation();

	const {
		data: categoriesData,
		isLoading: categoriesLoading,
		isError: categoriesError,
	} = useGetAllExpenseCategoriesQuery();

	// Define the validation schema using Yup
	const validationSchema = yup.object().shape({
		title: yup.string().trim().required("Title is required."),
		amount: yup
			.number()
			.typeError("Amount must be a number.")
			.positive("Amount must be greater than zero.")
			.required("Amount is required."),
		categoryCode: yup.string().required("Category is required."),
		expenseType: yup.string().required("Expense Type is required."),
		// Optional fields can have their own validations or be left as is
		description: yup.string(),
		paymentMethod: yup.string(),
		mood: yup.string(),
		createdAt: yup.date().nullable(),
		cognitiveTriggerCode: yup.array(),
	});

	// Initial values for Formik
	const initialValues = {
		title: "",
		amount: "",
		categoryCode: "",
		expenseType: "",
		cognitiveTriggerCode: [],
		description: "",
		paymentMethod: "",
		mood: moods[0],
		createdAt: "",
	};

	// Handle form submission
	const handleSubmit = async (values, { setSubmitting, resetForm }) => {
		try {
			const expenseData = {
				title: values.title.trim(),
				amount: Number(values.amount),
				categoryCode: values.categoryCode,
				expenseType: values.expenseType,
				cognitiveTriggerCodes: Array.isArray(values.cognitiveTriggerCode)
					? values.cognitiveTriggerCode
					: [values.cognitiveTriggerCode], // Ensure it's an array
				description: values.description.trim(),
				paymentMethod: values.paymentMethod,
				mood: values.mood,
				...(values.createdAt && {
					createdAt: new Date(values.createdAt).toISOString(),
				}),
			};

			// Filter out any fields with empty values (like "", null, undefined)
			const filteredExpenseData = Object.fromEntries(
				Object.entries(expenseData).filter(
					([key, value]) =>
						value !== "" &&
						value !== null &&
						value !== undefined &&
						!(Array.isArray(value) && value.length === 0)
				)
			);

			const response = await saveExpenses([filteredExpenseData]);

			if (response.data) {
				toast.success("Expense added successfully!");
				resetForm(); // Reset form fields
			} else {
				toast.error("Failed to add expense. Please try again.");
			}
		} catch (error) {
			console.error("Error saving expense:", error);
			toast.error("Failed to add expense. Please try again.");
		} finally {
			setSubmitting(false);
		}
	};

	// Define background color style
	const backgroundColorStyle = {
		backgroundColor: theme.palette.background.default,
	};

	return (
		<>
			<Typography
				variant="h3"
				sx={{ color: theme.palette.secondary[100], fontWeight: "bold" }}
			>
				Add Expense
			</Typography>
			<Box mt={3}>
				<Formik
					initialValues={initialValues}
					validationSchema={validationSchema}
					onSubmit={handleSubmit}
				>
					{({
						values,
						errors,
						touched,
						handleChange,
						handleBlur,
						isSubmitting,
						handleReset,
					}) => (
						<Form>
							<Grid container spacing={2}>
								{/* Title Field (Required) */}
								<Grid item xs={12} sm={6}>
									<TextField
										sx={{
											...backgroundColorStyle,
											"& .MuiFormHelperText-root": {
												backgroundColor: theme.palette.background.alt, // Light red background for error message
												color: "red", // Text color for error message
												padding: "4px 8px", // Add some padding for better spacing
												borderRadius: "4px", // Rounded corners for the error message background
												margin: 0, // Remove margin to ensure it aligns with the input field
												width: "100%", // Ensure the background covers the full width
												boxSizing: "border-box", // Ensure padding doesn't affect width calculations
											},
										}}
										label="Title"
										variant="outlined"
										name="title"
										value={values.title}
										onChange={handleChange}
										onBlur={handleBlur}
										required
										fullWidth
										error={touched.title && Boolean(errors.title)}
										helperText={touched.title && errors.title}
									/>
								</Grid>

								{/* Amount Field (Required) */}
								<Grid item xs={12} sm={6}>
									<TextField
										sx={{
											...backgroundColorStyle,
											"& .MuiFormHelperText-root": {
												backgroundColor: theme.palette.background.alt, // Light red background for error message
												color: "red", // Text color for error message
												padding: "4px 8px", // Add some padding for better spacing
												borderRadius: "4px", // Rounded corners for the error message background
												margin: 0, // Remove margin to ensure it aligns with the input field
												width: "100%", // Ensure the background covers the full width
												boxSizing: "border-box", // Ensure padding doesn't affect width calculations
											},
										}}
										label="Amount"
										variant="outlined"
										type="number"
										name="amount"
										value={values.amount}
										onChange={handleChange}
										onBlur={handleBlur}
										fullWidth
										required
										inputProps={{ min: "0", step: "0.01" }} // Ensure positive numbers and decimals
										error={touched.amount && Boolean(errors.amount)}
										helperText={touched.amount && errors.amount}
									/>
								</Grid>

								{/* Category Field (Required) */}
								<Grid item xs={12} sm={6}>
									<FormControl
										fullWidth
										variant="outlined"
										required
										error={touched.categoryCode && Boolean(errors.categoryCode)}
									>
										<InputLabel id="category-label">Category</InputLabel>
										<Select
											sx={{ ...backgroundColorStyle }}
											labelId="category-label"
											id="categoryCode"
											name="categoryCode"
											value={values.categoryCode}
											onChange={handleChange}
											onBlur={handleBlur}
											label="Category"
										>
											{categoriesLoading ? (
												<MenuItem disabled>Loading categories...</MenuItem>
											) : categoriesError ? (
												<MenuItem disabled>Error loading categories</MenuItem>
											) : (
												categoriesData?.categories?.map((category) => (
													<MenuItem key={category.code} value={category.code}>
														{category.name}
													</MenuItem>
												))
											)}
										</Select>
										{touched.categoryCode && errors.categoryCode && (
											<Typography variant="caption" color="error">
												{errors.categoryCode}
											</Typography>
										)}
									</FormControl>
								</Grid>

								{/* Expense Type Field (Required) */}
								<Grid item xs={12} sm={6}>
									<FormControl
										fullWidth
										variant="outlined"
										required
										error={touched.expenseType && Boolean(errors.expenseType)}
									>
										<InputLabel id="expense-type-label">
											Expense Type
										</InputLabel>
										<Select
											sx={{ ...backgroundColorStyle }}
											labelId="expense-type-label"
											id="expenseType"
											name="expenseType"
											value={values.expenseType}
											onChange={handleChange}
											onBlur={handleBlur}
											label="Expense Type"
										>
											{expenseTypes.map((type) => (
												<MenuItem key={type} value={type}>
													{capitalizeFirstLetter(type)}
												</MenuItem>
											))}
										</Select>
										{touched.expenseType && errors.expenseType && (
											<Typography variant="caption" color="error">
												{errors.expenseType}
											</Typography>
										)}
									</FormControl>
								</Grid>

								{/* Psychological Type Field (Optional) */}
								<Grid item xs={12} sm={6}>
									<FormControl fullWidth variant="outlined">
										<InputLabel id="psychologicaltype-label">
											Cognitive Triggers
										</InputLabel>
										<Select
											sx={{ ...backgroundColorStyle }}
											labelId="psychologicaltype-label"
											id="cognitiveTriggerCode"
											name="cognitiveTriggerCode"
											value={values.cognitiveTriggerCode}
											onChange={handleChange}
											onBlur={handleBlur}
											label="Psychological Type"
											multiple // Allow selecting multiple values
											renderValue={(selected) =>
												selected
													.map(
														(code) =>
															cognitiveTriggersData?.cognitiveTriggers?.find(
																(trigger) => trigger.code === code
															)?.name
													)
													.join(", ")
											}
										>
											{cognitiveTriggersDataLoading ? (
												<MenuItem disabled>Loading...</MenuItem>
											) : cognitiveTriggersDataError ? (
												<MenuItem disabled>Error loading triggers</MenuItem>
											) : (
												cognitiveTriggersData?.cognitiveTriggers?.map(
													(cognitiveTrigger) => (
														<MenuItem
															key={cognitiveTrigger.code}
															value={cognitiveTrigger.code}
														>
															{cognitiveTrigger.name}
														</MenuItem>
													)
												)
											)}
										</Select>
									</FormControl>
								</Grid>

								{/* Payment Method Field (Optional) */}
								<Grid item xs={12} sm={6}>
									<FormControl fullWidth variant="outlined">
										<InputLabel id="payment-method-label">
											Payment Method
										</InputLabel>
										<Select
											sx={{ ...backgroundColorStyle }}
											labelId="payment-method-label"
											id="paymentMethod"
											name="paymentMethod"
											value={values.paymentMethod}
											onChange={handleChange}
											onBlur={handleBlur}
											label="Payment Method"
										>
											{[
												"cash",
												"credit_card",
												"debit_card",
												"online_payment",
												"unknown",
											].map((method) => (
												<MenuItem key={method} value={method}>
													{capitalizeFirstLetter(method.replace("_", " "))}
												</MenuItem>
											))}
										</Select>
									</FormControl>
								</Grid>

								{/* Mood after transaction Field (Optional) */}
								<Grid item xs={12} sm={6}>
									<FormControl fullWidth variant="outlined">
										<InputLabel id="mood-label">
											Mood after transaction
										</InputLabel>
										<Select
											sx={{ ...backgroundColorStyle }}
											labelId="mood-label"
											id="mood"
											name="mood"
											value={values.mood}
											onChange={handleChange}
											onBlur={handleBlur}
											label="Mood after transaction"
										>
											{moods.map((mood_) => (
												<MenuItem key={mood_} value={mood_}>
													{capitalizeFirstLetter(mood_)}
												</MenuItem>
											))}
										</Select>
									</FormControl>
								</Grid>

								{/* Created At Field (Optional) */}
								<Grid item xs={12} sm={6}>
									<TextField
										sx={{ ...backgroundColorStyle }}
										label="Created At"
										variant="outlined"
										type="datetime-local"
										name="createdAt"
										value={values.createdAt}
										onChange={handleChange}
										onBlur={handleBlur}
										fullWidth
										InputLabelProps={{ shrink: true }}
									/>
								</Grid>

								{/* Description Field (Optional) */}
								<Grid item xs={12} sm={6}>
									<TextField
										sx={{ ...backgroundColorStyle }}
										label="Description"
										variant="outlined"
										name="description"
										value={values.description}
										onChange={handleChange}
										onBlur={handleBlur}
										fullWidth
										multiline
										rows={3} // Increased number of rows for a bigger input
									/>
								</Grid>
							</Grid>

							{/* Submit Button */}
							<Button
								type="submit" // Change to type="submit" to trigger Formik's handleSubmit
								variant="outlined"
								color="secondary"
								disabled={isSubmitting || isLoading}
								sx={{ mt: 2, fontSize: 15, p: 2, paddingInline: 4 }}
							>
								{isLoading ? <CircularProgress size={24} /> : "Upload Data"}
							</Button>

							{/* Error Message */}
							{isError && (
								<Typography variant="body1" color="error" sx={{ mt: 2 }}>
									Error uploading data. Please try again.
								</Typography>
							)}
						</Form>
					)}
				</Formik>
			</Box>
		</>
	);
};

export default ExpensesForm;
