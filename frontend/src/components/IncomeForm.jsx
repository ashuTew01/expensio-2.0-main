import React, { useEffect, useState } from "react";
import {
	Box,
	Typography,
	TextField,
	Button,
	Grid,
	CircularProgress,
	FormControlLabel,
	Checkbox,
	useTheme,
	MenuItem,
	Select,
	FormControl,
	InputLabel,
} from "@mui/material";
import {
	useSaveIncomeMutation,
	useGetAllIncomeCategoriesQuery,
} from "../state/api";
import { toast } from "react-toastify";
import { capitalizeFirstLetter } from "../utils/capitalizeFirstLetter";

const IncomeForm = ({
	cognitiveTriggersData,
	cognitiveTriggersDataLoading,
	cognitiveTriggersDataError,
}) => {
	const theme = useTheme();
	const [title, setTitle] = useState("");
	const [amount, setAmount] = useState(0);
	const [categoryCode, setCategoryCode] = useState("");
	const [description, setDescription] = useState("");
	const [incomeType, setIncomeType] = useState("");
	const [createdAt, setCreatedAt] = useState(""); // New state for createdAt
	// const [dateTime, setDateTime] = useState(new Date());
	// const [event, setEvent] = useState("");
	// const [expenseType, setExpenseType] = useState("");
	// const [cognitiveTriggerCode, setCognitiveTriggerCode] = useState([]);
	// const [paymentMethod, setPaymentMethod] = useState("");

	const [saveIncome, { isLoading, isError }] = useSaveIncomeMutation();

	const {
		data: categoriesData,
		isLoading: categoriesLoading,
		isError: categoriesError,
	} = useGetAllIncomeCategoriesQuery();

	const handleCategoryChange = (event) => {
		setCategoryCode(event.target.value);
	};

	const handleCreatedAtChange = (event) => {
		setCreatedAt(event.target.value);
	};

	const resetForm = () => {
		setAmount(0);
		setTitle("");
		setCategoryCode("");
		setDescription("");
		setIncomeType("");
		setCreatedAt("");
	};
	const handleSubmit = async () => {
		try {
			const incomeData = {
				title,
				amount: Number(amount),
				categoryCode,
				description,
				incomeType,
				...(createdAt && { createdAt: new Date(createdAt).toISOString() }),
			};

			// Filter out any fields with empty values (like "", null, undefined)
			const filteredExpenseData = Object.fromEntries(
				Object.entries(incomeData).filter(
					([key, value]) =>
						value !== "" &&
						value !== null &&
						value !== undefined &&
						!(Array.isArray(value) && value.length === 0)
				)
			);
			console.log(filteredExpenseData);

			const response = await saveIncome([filteredExpenseData]);

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
				Add Income
			</Typography>
			<Box mt={3}>
				<Grid container spacing={2}>
					<Grid item xs={6}>
						<TextField
							sx={{ ...backgroundColorStyle }}
							label="Title"
							variant="outlined"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							fullWidth
						/>
					</Grid>
					<Grid item xs={6}>
						<TextField
							sx={{ ...backgroundColorStyle }}
							label="Amount"
							variant="outlined"
							type="number"
							value={amount}
							onChange={(e) => setAmount(e.target.value)}
							fullWidth
						/>
					</Grid>
					<Grid item xs={6}>
						<FormControl fullWidth variant="outlined">
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

					<Grid item xs={6}>
						<FormControl fullWidth variant="outlined">
							<InputLabel id="income-type-label">Income Type</InputLabel>
							<Select
								sx={{ ...backgroundColorStyle }}
								labelId="income-type-label"
								value={incomeType}
								onChange={(e) => setIncomeType(e.target.value)}
								label="Income Type"
							>
								{["primary", "secondary", "settlement", "unknown"].map(
									(method) => (
										<MenuItem key={method} value={method}>
											{capitalizeFirstLetter(method.replace("_", " "))}
										</MenuItem>
									)
								)}
							</Select>
						</FormControl>
					</Grid>

					{/* New Created At Input */}
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
			<Button
				variant="outlined"
				color="secondary"
				onClick={handleSubmit}
				disabled={isLoading}
				sx={{ mt: 4, fontSize: 15, p: 2, paddingInline: 4 }}
			>
				{isLoading ? <CircularProgress size={24} /> : "Upload Data"}
			</Button>
			{isError && (
				<Typography variant="body1" color="error" sx={{ mt: 2 }}>
					Error uploading data. Please try again.
				</Typography>
			)}
		</>
	);
};

export default IncomeForm;
