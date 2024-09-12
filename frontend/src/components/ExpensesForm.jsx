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
	useSaveExpensesMutation,
	useGetAllCategoriesQuery,
	useGetAllEventsQuery,
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
	const [amount, setAmount] = useState(0);
	const [categoryCode, setCategoryCode] = useState("");
	// const [dateTime, setDateTime] = useState(new Date());
	// const [event, setEvent] = useState("");
	const [expenseType, setExpenseType] = useState("");
	const [cognitiveTriggerCode, setCognitiveTriggerCode] = useState("");
	const [description, setDescription] = useState("");
	//   const [notes, setNotes] = useState("");
	//   const [image, setImage] = useState("");
	const [paymentMethod, setPaymentMethod] = useState("");
	const [mood, setMood] = useState(moods[0]);
	//   const [goalId, setGoalId] = useState("");

	const [saveExpenses, { isLoading, isError }] = useSaveExpensesMutation();
	// console.log(expenseType)

	// const {
	//   data: userEvents,
	//   isLoading: isLoadingEvents,
	//   isError: eventsError,
	// } = useGetAllEventsQuery();
	//   console.log(JSON.parse(localStorage.getItem("tokenExpensio")));

	const {
		data: categoriesData,
		isLoading: categoriesLoading,
		isError: categoriesError,
	} = useGetAllCategoriesQuery();

	const handleCategoryChange = (event) => {
		setCategoryCode(event.target.value);
	};
	const handleSubmit = async () => {
		try {
			const expenseData = {
				title,
				amount,
				categoryCode,
				expenseType,
				cognitiveTriggerCodes: [cognitiveTriggerCode],
				description,
				paymentMethod,
				mood,
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

			// const response = await saveExpenses([{
			//   title,
			//   amount,
			//   categoryCode,
			//   dateTime,
			//   expenseType,
			//   cognitiveTriggerCodes : [cognitiveTriggerCode],
			//   description,
			//   paymentMethod,
			//   mood,
			// }]);
			// Check if the mutation is successful
			if (response.data) {
				// If successful, display success notification
				toast.success("Expense added successfully!");
				setAmount(0);
				setTitle("");
				setCategoryCode("");
				// setDateTime("");
				setExpenseType("");
				setCognitiveTriggerCode("");
				setDescription("");
				setPaymentMethod("");
				setMood("");
			} else {
				// If not successful, display error notification
				toast.error("Failed to add expense. Please try again.");
			}
		} catch (error) {
			// If an error is caught, display error notification
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
					{/* <Grid item xs={6}>
            <TextField
              sx={{ ...backgroundColorStyle }}
              label="Date & Time"
              variant="outlined"
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid> */}
					<Grid item xs={6}>
						<FormControl fullWidth variant="outlined">
							<InputLabel id="event-label">Expense Type</InputLabel>
							<Select
								sx={{ ...backgroundColorStyle }}
								labelId="event-label2"
								value={expenseType}
								onChange={(e) => setExpenseType(e.target.value)}
								label="Event"
							>
								{expenseTypes.map((expenseType) => (
									<MenuItem key={expenseType} value={expenseType}>
										{capitalizeFirstLetter(expenseType)}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={6}>
						<FormControl fullWidth variant="outlined">
							<InputLabel id="psycho-types-label">
								Psychological Type
							</InputLabel>
							<Select
								sx={{ ...backgroundColorStyle }}
								labelId="psychologicaltype-label"
								value={cognitiveTriggerCode}
								onChange={(e) => setCognitiveTriggerCode(e.target.value)}
								label="Psychological Type"
							>
								{cognitiveTriggersDataLoading ? (
									<MenuItem disabled>Loading...</MenuItem>
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
					<Grid item xs={6}>
						<TextField
							sx={{ ...backgroundColorStyle }}
							label="Description"
							variant="outlined"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							fullWidth
						/>
					</Grid>
					{/* <Grid item xs={6}>
            <TextField
              sx={{ ...backgroundColorStyle }}
              label="Notes"
              variant="outlined"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              fullWidth
            />
          </Grid> */}
					{/* <Grid item xs={6}>
            <TextField
              sx={{ ...backgroundColorStyle }}
              label="Image"
              variant="outlined"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              fullWidth
            />
          </Grid> */}
					<Grid item xs={6}>
						<TextField
							sx={{ ...backgroundColorStyle }}
							label="Payment Method"
							variant="outlined"
							value={paymentMethod}
							onChange={(e) => setPaymentMethod(e.target.value)}
							fullWidth
						/>
					</Grid>
					<Grid item xs={6}>
						<FormControl fullWidth variant="outlined">
							<InputLabel id="mood-label">Mood after transaction</InputLabel>
							<Select
								sx={{ ...backgroundColorStyle }}
								labelId="mood-label2"
								value={mood}
								onChange={(e) => setMood(e.target.value)}
								label="Mood"
							>
								{moods.map((mood_) => (
									<MenuItem
										key={mood_}
										value={mood_}
										label={capitalizeFirstLetter(mood_)}
									>
										{capitalizeFirstLetter(mood_)}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Grid>
					{/* <Grid item xs={6}>
            <TextField
              sx={{ ...backgroundColorStyle }}
              label="Goal ID"
              variant="outlined"
              value={goalId}
              onChange={(e) => setGoalId(e.target.value)}
              fullWidth
            />
          </Grid> */}
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

export default ExpensesForm;
