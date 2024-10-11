// src/scenes/expense/ExpenseScreen.jsx

import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme, useMediaQuery } from "@mui/material";
import {
	Box,
	Button,
	Card,
	CardContent,
	Typography,
	Grid,
	Chip,
	Stack,
	Tooltip,
	Divider,
} from "@mui/material";
import { ArrowBack, Edit, Delete } from "@mui/icons-material";

import FlexBetween from "../../../components/FlexBetween";
import AnimatedLoadingIndicator from "../../../components/AnimatedLoadingIndicator";
import ErrorDisplay from "../../../components/error/ErrorDisplay";
import ConfirmationDialog from "../../../components/ConfirmationDialog";

import {
	useGetExpenseByIdQuery,
	useDeleteExpensesMutation,
} from "../../../state/api";
import { toast } from "react-toastify";

const ExpenseScreen = () => {
	const theme = useTheme();
	const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
	const navigate = useNavigate();
	const { id } = useParams();

	// Fetch expense details
	const { data, isLoading, isError, error } = useGetExpenseByIdQuery({ id });

	// Initialize delete mutation
	const [deleteExpenses, { isLoading: isDeleting }] =
		useDeleteExpensesMutation();

	// State for confirmation dialog
	const [isDialogOpen, setIsDialogOpen] = React.useState(false);

	// Extract expense data
	const expense = data?.expenses?.[0];
	console.log(expense);

	// Create a mapping from code to name for Cognitive Triggers
	const cognitiveTriggerMap = useMemo(() => {
		const map = {};
		expense?.cognitiveTriggerIds?.forEach((trigger) => {
			map[trigger.code] = trigger.name;
		});
		return map;
	}, [expense]);

	// Handle delete action
	const handleDelete = () => {
		setIsDialogOpen(true);
	};

	const handleConfirmDelete = async () => {
		if (!expense?._id) return;

		try {
			await deleteExpenses([expense._id]).unwrap();
			toast.success("Expense deleted successfully.");
			setIsDialogOpen(false);
			navigate("/expense/list"); // Navigate back to the expense list
		} catch (err) {
			toast.error(err?.data?.message || "Failed to delete expense.");
		}
	};

	const handleCancelDelete = () => {
		setIsDialogOpen(false);
	};

	// Handle loading state
	if (isLoading) return <AnimatedLoadingIndicator height="500px" />;

	// Handle error state
	if (isError)
		return (
			<ErrorDisplay
				text={error?.data?.message || "Error loading expense details."}
				retry={true}
				onRetry={() => navigate("/expense/list")}
				buttonText="Back"
			/>
		);

	// Handle no data
	if (!expense)
		return (
			<ErrorDisplay
				message="No expense data found."
				retry={true}
				onRetry={() => navigate("/expense/list")}
				buttonText="Back"
			/>
		);

	return (
		<Box m="2rem" display="flex" flexDirection="column" alignItems="center">
			{/* Header with Back and Action Buttons */}
			<FlexBetween width="100%" mb="2rem">
				<Button
					startIcon={<ArrowBack />}
					onClick={() => navigate(-1)}
					variant="contained"
					sx={{
						color: theme.palette.background.alt,
						fontSize: "14px",
						fontWeight: "bold",
						padding: "10px 20px",
						borderRadius: "8px",
						backgroundColor: theme.palette.common.white,
						transition: "all 0.3s ease",
						"&:hover": {
							transform: "scale(1.05)",
							backgroundColor: theme.palette.background.alt,
							color: "#fff",
						},
					}}
				>
					BACK
				</Button>
				<Box>
					<Tooltip title="Delete Expense">
						<Button
							startIcon={<Delete />}
							onClick={handleDelete}
							variant="outlined"
							disabled={isDeleting}
							sx={{
								textTransform: "none",
								padding: "0.5rem 1.5rem",
								borderRadius: "8px",
								borderColor: theme.palette.error.main,
								color: theme.palette.error.main,
								boxShadow: theme.shadows[3],
								transition: "all 0.3s ease",
								"&:hover": {
									backgroundColor: theme.palette.error.light,
									color: theme.palette.error.contrastText,
									boxShadow: theme.shadows[8],
									transform: "scale(1.05)",
								},
							}}
						>
							{isDeleting ? "Deleting..." : "Delete"}
						</Button>
					</Tooltip>
				</Box>
			</FlexBetween>

			{/* Expense Details Card with Hover Animation */}
			<Card
				sx={{
					width: isNonMediumScreens ? "60%" : "90%",
					boxShadow: 6,
					borderRadius: 3,
					backgroundColor: theme.palette.background.alt,
					transition: "transform 0.3s, box-shadow 0.3s",
					"&:hover": {
						transform: "translateY(-8px) scale(1.02)",
						boxShadow: theme.shadows[12],
					},
				}}
			>
				<CardContent>
					{/* Title and Description */}
					<Box mb="1.5rem">
						{/* Conditionally render Title */}
						{expense.title && (
							<Typography
								variant="h4"
								component="h2"
								gutterBottom
								sx={{ fontWeight: "bold", color: theme.palette.text.primary }}
							>
								{expense.title}
							</Typography>
						)}

						{/* Conditionally render Description */}
						{expense.description && (
							<Typography
								variant="body1"
								color="text.secondary"
								sx={{ fontStyle: "normal" }}
							>
								{expense.description}
							</Typography>
						)}
					</Box>

					<Divider sx={{ mb: "1.5rem" }} />

					{/* Details Grid */}
					<Grid container spacing={3}>
						{/* Amount */}
						<Grid item xs={12} sm={6}>
							<Typography
								variant="subtitle2"
								color="text.secondary"
								sx={{ fontWeight: "bold", fontSize: "1rem", mb: "0.5rem" }}
							>
								Amount
							</Typography>
							<Typography variant="h6" color="text.primary">
								₹ {expense.amount.toFixed(2)}
							</Typography>
						</Grid>

						{/* Payment Method - Conditionally Render */}
						{expense.paymentMethod &&
							expense.paymentMethod.toLowerCase() !== "unknown" && (
								<Grid item xs={12} sm={6}>
									<Typography
										variant="subtitle2"
										color="text.secondary"
										sx={{ fontWeight: "bold", fontSize: "1rem", mb: "0.5rem" }}
									>
										Payment Method
									</Typography>
									<Typography
										variant="h6"
										color="text.primary"
										sx={{ textTransform: "capitalize" }}
									>
										{expense.paymentMethod}
									</Typography>
								</Grid>
							)}

						{/* Category */}
						<Grid item xs={12} sm={6}>
							<Typography
								variant="subtitle2"
								color="text.secondary"
								sx={{ fontWeight: "bold", fontSize: "1rem", mb: "0.5rem" }}
							>
								Category
							</Typography>
							<Chip
								label={expense.categoryId.name}
								sx={{
									backgroundColor: expense.categoryId.color,
									color: "#fff",
									fontWeight: "bold",
									fontSize: "1rem",
								}}
							/>
						</Grid>

						{/* Cognitive Triggers */}
						<Grid item xs={12} sm={6}>
							<Typography
								variant="subtitle2"
								color="text.secondary"
								sx={{
									fontWeight: "bold",
									fontSize: "1rem",
									mb: "0.5rem",
								}}
							>
								Cognitive Triggers
							</Typography>
							<Stack direction="row" spacing={1} flexWrap="wrap">
								{!expense.cognitiveTriggerIds ? (
									<Chip
										label="None"
										color="primary"
										variant="outlined"
										sx={{
											fontWeight: "bold",
											fontSize: "0.9rem",
										}}
									/>
								) : (
									expense.cognitiveTriggerIds?.map((trigger) => (
										<Chip
											key={trigger._id}
											label={trigger.name}
											color="#4d4a49"
											variant="outlined"
											sx={{
												fontSize: "0.9rem",
											}}
										/>
									))
								)}
							</Stack>
						</Grid>

						{/* Mood */}
						<Grid item xs={12} sm={6}>
							<Typography
								variant="subtitle2"
								color="text.secondary"
								sx={{ fontWeight: "bold", fontSize: "1rem", mb: "0.5rem" }}
							>
								Mood
							</Typography>
							<Chip
								label={expense.mood}
								color={
									expense.mood.toLowerCase() === "happy"
										? "success"
										: expense.mood.toLowerCase() === "neutral"
											? "default"
											: "error"
								}
								sx={{
									fontWeight: "bold",
									fontSize: "1rem",
								}}
							/>
						</Grid>

						{/* Created At */}
						<Grid item xs={12} sm={6}>
							<Typography
								variant="subtitle2"
								color="text.secondary"
								sx={{ fontWeight: "bold", fontSize: "1rem", mb: "0.5rem" }}
							>
								Created At
							</Typography>
							<Typography variant="h6" color="text.primary">
								{new Date(expense.createdAt).toLocaleString()}
							</Typography>
						</Grid>
					</Grid>
				</CardContent>
			</Card>

			{/* Confirmation Dialog for Deletion */}
			<ConfirmationDialog
				open={isDialogOpen}
				title="Delete Expense"
				message="Are you sure you want to delete this expense? This action cannot be undone."
				onConfirm={handleConfirmDelete}
				onCancel={handleCancelDelete}
				confirmText="Delete"
				cancelText="Cancel"
				confirmButtonColor="error"
				cancelButtonColor="primary"
			/>
		</Box>
	);
};

export default ExpenseScreen;
