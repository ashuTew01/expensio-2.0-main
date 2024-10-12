// src/components/ExpensesForm.jsx
import React, { useEffect, useState } from "react";
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
	const [title, setTitle] = useState("");
	const [amount, setAmount] = useState("");
	const [categoryCode, setCategoryCode] = useState("");
	const [expenseType, setExpenseType] = useState("");
	const [cognitiveTriggerCode, setCognitiveTriggerCode] = useState([]);
	const [description, setDescription] = useState("");
	const [paymentMethod, setPaymentMethod] = useState("");
	const [mood, setMood] = useState(moods[0]);
	const [createdAt, setCreatedAt] = useState(""); // Initialize as empty string

	const [saveExpenses, { isLoading, isError }] = useSaveExpensesMutation();

	const {
		data: categoriesData,
		isLoading: categoriesLoading,
		isError: categoriesError,
	} = useGetAllExpenseCategoriesQuery();

	const handleCategoryChange = (event) => {
		setCategoryCode(event.target.value);
	};

	const handleCreatedAtChange = (event) => {
		setCreatedAt(event.target.value);
	};

	const resetForm = () => {
		setAmount("");
		setTitle("");
		setCategoryCode("");
		setExpenseType("");
		setCognitiveTriggerCode([]);
		setDescription("");
		setPaymentMethod("");
		setMood(moods[0]);
		setCreatedAt("");
	};

	const handleSubmit = async () => {
		// Validate mandatory fields
		if (!title.trim()) {
			toast.error("Title is required.");
			return;
		}
		if (!amount || Number(amount) <= 0) {
			toast.error("Please enter a valid amount.");
			return;
		}
		if (!categoryCode) {
			toast.error("Category is required.");
			return;
		}
		if (!expenseType) {
			toast.error("Expense Type is required.");
			return;
		}

		try {
			const expenseData = {
				title: title.trim(),
				amount: Number(amount),
				categoryCode,
				expenseType,
				cognitiveTriggerCodes: Array.isArray(cognitiveTriggerCode)
					? cognitiveTriggerCode
					: [cognitiveTriggerCode], // Ensure it's an array
				description: description.trim(),
				paymentMethod,
				mood,
				...(createdAt && { createdAt: new Date(createdAt).toISOString() }),
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
			// console.log(filteredExpenseData);

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
		}
	};

	const backgroundColorStyle = {
		backgroundColor: theme.palette.background.default,
		// fontColor: "black",
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
				<Grid container spacing={2}>
					{/* Title Field (Required) */}
					<Grid item xs={6}>
						<TextField
							sx={{ ...backgroundColorStyle }}
							label="Title"
							variant="outlined"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							fullWidth
							required
						/>
					</Grid>

					{/* Amount Field (Required) */}
					<Grid item xs={6}>
						<TextField
							sx={{ ...backgroundColorStyle }}
							label="Amount"
							variant="outlined"
							type="number"
							value={amount}
							onChange={(e) => setAmount(e.target.value)}
							fullWidth
							required
						/>
					</Grid>

					{/* Category Field (Required) */}
					<Grid item xs={6}>
						<FormControl fullWidth variant="outlined" required>
							<InputLabel id="category-label">Category</InputLabel>
							<Select
								sx={{ ...backgroundColorStyle }}
								labelId="category-label"
								value={categoryCode}
								onChange={handleCategoryChange}
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
						</FormControl>
					</Grid>

					{/* Expense Type Field (Required) */}
					<Grid item xs={6}>
						<FormControl fullWidth variant="outlined" required>
							<InputLabel id="expense-type-label">Expense Type</InputLabel>
							<Select
								sx={{ ...backgroundColorStyle }}
								labelId="expense-type-label"
								value={expenseType}
								onChange={(e) => setExpenseType(e.target.value)}
								label="Expense Type"
							>
								{expenseTypes.map((type) => (
									<MenuItem key={type} value={type}>
										{capitalizeFirstLetter(type)}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Grid>

					{/* Psychological Type Field */}
					<Grid item xs={6}>
						<FormControl fullWidth variant="outlined">
							<InputLabel id="psychologicaltype-label">
								Psychological Type
							</InputLabel>
							<Select
								sx={{ ...backgroundColorStyle }}
								labelId="psychologicaltype-label"
								value={cognitiveTriggerCode}
								onChange={(e) => setCognitiveTriggerCode(e.target.value)}
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

					{/* Payment Method Field */}
					<Grid item xs={6}>
						<FormControl fullWidth variant="outlined">
							<InputLabel id="payment-method-label">Payment Method</InputLabel>
							<Select
								sx={{ ...backgroundColorStyle }}
								labelId="payment-method-label"
								value={paymentMethod}
								onChange={(e) => setPaymentMethod(e.target.value)}
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

					{/* Mood after transaction Field */}
					<Grid item xs={6}>
						<FormControl fullWidth variant="outlined">
							<InputLabel id="mood-label">Mood after transaction</InputLabel>
							<Select
								sx={{ ...backgroundColorStyle }}
								labelId="mood-label"
								value={mood}
								onChange={(e) => setMood(e.target.value)}
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

					{/* Created At Field */}
					<Grid item xs={6}>
						<TextField
							sx={{ ...backgroundColorStyle }}
							label="Created At"
							variant="outlined"
							type="datetime-local"
							value={createdAt}
							onChange={handleCreatedAtChange}
							fullWidth
							InputLabelProps={{ shrink: true }}
						/>
					</Grid>

					{/* Description Field */}
					<Grid item xs={6}>
						<TextField
							sx={{ ...backgroundColorStyle }}
							label="Description"
							variant="outlined"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							fullWidth
							multiline
							rows={3} // Increased number of rows for a bigger input
						/>
					</Grid>
				</Grid>
			</Box>

			{/* Submit Button */}
			<Button
				variant="outlined"
				color="secondary"
				onClick={handleSubmit}
				disabled={isLoading}
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
		</>
	);
};

export default ExpensesForm;
