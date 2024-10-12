// src/components/IncomeForm.jsx
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
	useSaveIncomeMutation,
	useGetAllIncomeCategoriesQuery,
} from "../state/api";
import { toast } from "react-toastify";
import { capitalizeFirstLetter } from "../utils/capitalizeFirstLetter";
import "react-toastify/dist/ReactToastify.css";

const IncomeForm = ({
	cognitiveTriggersData,
	cognitiveTriggersDataLoading,
	cognitiveTriggersDataError,
}) => {
	const theme = useTheme();
	const moods = ["neutral", "happy", "regretful"];
	const incomeTypes = ["primary", "secondary", "settlement", "unknown"];

	const [saveIncome, { isLoading, isError }] = useSaveIncomeMutation();

	const {
		data: categoriesData,
		isLoading: categoriesLoading,
		isError: categoriesError,
	} = useGetAllIncomeCategoriesQuery();

	// Define the validation schema using Yup
	const validationSchema = yup.object().shape({
		title: yup.string().trim().required("Title is required."),
		amount: yup
			.number()
			.typeError("Amount must be a number.")
			.positive("Amount must be greater than zero.")
			.required("Amount is required."),
		categoryCode: yup.string().required("Category is required."),
		incomeType: yup.string().required("Income Type is required."),
		// Optional fields can have their own validations or be left as is
		description: yup.string(),
		createdAt: yup.date().nullable(),
	});

	// Initial values for Formik
	const initialValues = {
		title: "",
		amount: "",
		categoryCode: "",
		incomeType: "",
		description: "",
		createdAt: "",
	};

	// Handle form submission
	const handleSubmit = async (values, { setSubmitting, resetForm }) => {
		try {
			const incomeData = {
				title: values.title.trim(),
				amount: Number(values.amount),
				categoryCode: values.categoryCode,
				incomeType: values.incomeType,
				description: values.description.trim(),
				...(values.createdAt && {
					createdAt: new Date(values.createdAt).toISOString(),
				}),
			};

			// Filter out any fields with empty values (like "", null, undefined)
			const filteredIncomeData = Object.fromEntries(
				Object.entries(incomeData).filter(
					([key, value]) =>
						value !== "" &&
						value !== null &&
						value !== undefined &&
						!(Array.isArray(value) && value.length === 0)
				)
			);

			console.log(filteredIncomeData);

			const response = await saveIncome([filteredIncomeData]);

			if (response.data) {
				toast.success("Income added successfully!");
				resetForm(); // Reset form fields
			} else {
				toast.error("Failed to add income. Please try again.");
			}
		} catch (error) {
			console.error("Error saving income:", error);
			toast.error("Failed to add income. Please try again.");
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
				Add Income
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
										fullWidth
										required
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

								{/* Income Type Field (Required) */}
								<Grid item xs={12} sm={6}>
									<FormControl
										fullWidth
										variant="outlined"
										required
										error={touched.incomeType && Boolean(errors.incomeType)}
									>
										<InputLabel id="income-type-label">Income Type</InputLabel>
										<Select
											sx={{ ...backgroundColorStyle }}
											labelId="income-type-label"
											id="incomeType"
											name="incomeType"
											value={values.incomeType}
											onChange={handleChange}
											onBlur={handleBlur}
											label="Income Type"
										>
											{incomeTypes.map((method) => (
												<MenuItem key={method} value={method}>
													{capitalizeFirstLetter(method.replace("_", " "))}
												</MenuItem>
											))}
										</Select>
										{touched.incomeType && errors.incomeType && (
											<Typography variant="caption" color="error">
												{errors.incomeType}
											</Typography>
										)}
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
										rows={4} // Increased number of rows for a bigger input
										error={touched.description && Boolean(errors.description)}
										helperText={touched.description && errors.description}
									/>
								</Grid>
							</Grid>

							{/* Submit Button */}
							<Button
								type="submit" // Change to type="submit" to trigger Formik's handleSubmit
								variant="outlined"
								color="secondary"
								disabled={isSubmitting || isLoading}
								sx={{ mt: 4, fontSize: 15, p: 2, paddingInline: 4 }}
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

export default IncomeForm;
