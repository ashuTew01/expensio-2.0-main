// src/scenes/income/IncomeScreen.jsx

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
import Header from "../../../components/Header";
import AnimatedLoadingIndicator from "../../../components/AnimatedLoadingIndicator";
import ErrorDisplay from "../../../components/error/ErrorDisplay";
import ConfirmationDialog from "../../../components/ConfirmationDialog";

import {
	useGetIncomeByIdQuery,
	useDeleteIncomesMutation,
} from "../../../state/api";
import { toast } from "react-toastify";

const IncomeScreen = () => {
	const theme = useTheme();
	const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
	const navigate = useNavigate();
	const { id } = useParams();

	// Fetch income details
	const { data, isLoading, isError, error } = useGetIncomeByIdQuery({ id });

	// Initialize delete mutation
	const [deleteIncomes, { isLoading: isDeleting }] = useDeleteIncomesMutation();

	// State for confirmation dialog
	const [isDialogOpen, setIsDialogOpen] = React.useState(false);

	// Extract income data
	const income = data?.incomes?.[0];

	// Create a mapping from code to name for Cognitive Triggers (if applicable)
	const cognitiveTriggerMap = useMemo(() => {
		const map = {};
		income?.cognitiveTriggerIds?.forEach((trigger) => {
			map[trigger.code] = trigger.name;
		});
		return map;
	}, [income]);

	// Handle delete action
	const handleDelete = () => {
		setIsDialogOpen(true);
	};

	const handleConfirmDelete = async () => {
		if (!income?._id) return;

		try {
			await deleteIncomes([income._id]).unwrap();
			toast.success("Income deleted successfully.");
			setIsDialogOpen(false);
			navigate("/income/list"); // Navigate back to the income list
		} catch (err) {
			toast.error(err?.data?.message || "Failed to delete income.");
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
				message={error?.data?.message || "Error loading income details."}
				retry={true}
				onRetry={() => navigate("/income/list")}
				buttonText="Back"
			/>
		);

	// Handle no data
	if (!income)
		return (
			<ErrorDisplay
				message="No income data found."
				retry={true}
				onRetry={() => navigate("/income/list")}
				buttonText="Back"
			/>
		);

	return (
		<Box
			m="2rem"
			display="flex"
			flexDirection="column"
			alignItems="center"
			sx={{
				padding: "2rem",
				boxSizing: "border-box",
			}}
		>
			{/* Header with Back and Action Buttons */}
			<FlexBetween width="100%" mb="2rem">
				<Button
					startIcon={<ArrowBack />}
					onClick={() => navigate("/income/list")}
					variant="contained"
					color={theme.palette.background.default}
					sx={{
						backgroundColor: theme.palette.secondary.light,
						color: theme.palette.background.alt,
						fontSize: "12px",
						fontWeight: "bold",
						padding: "10px 20px",
						"&:hover": { backgroundColor: "#afafaf" },
					}}
				>
					Back to Incomes
				</Button>
				<Box>
					<Tooltip title="Delete Income">
						<Button
							startIcon={<Delete />}
							onClick={handleDelete}
							variant="outlined"
							color="error"
							disabled={isDeleting}
							sx={{
								textTransform: "none",
								padding: "0.5rem 1.5rem",
								borderRadius: "8px",
								borderColor: theme.palette.error.main,
								color: theme.palette.error.main,
								boxShadow: theme.shadows[3],
								"&:hover": {
									backgroundColor: "#fff",
								},
							}}
						>
							{isDeleting ? "Deleting..." : "Delete"}
						</Button>
					</Tooltip>
				</Box>
			</FlexBetween>

			{/* Income Details Card */}
			<Card
				sx={{
					width: isNonMediumScreens ? "60%" : "90%",
					boxShadow: 6,
					borderRadius: 3,
					backgroundColor: theme.palette.background.paper,
					transition: "transform 0.3s, box-shadow 0.3s",
					"&:hover": {
						transform: "translateY(-5px)",
						boxShadow: 10,
					},
				}}
			>
				<CardContent>
					{/* Title and Description */}
					<Box mb="1.5rem">
						{/* Conditionally render Title */}
						{income.title && (
							<Typography
								variant="h4"
								component="h2"
								gutterBottom
								sx={{ fontWeight: "bold", color: theme.palette.text.primary }}
							>
								{income.title}
							</Typography>
						)}

						{/* Conditionally render Description */}
						{income.description && (
							<Typography
								variant="body1"
								color="text.secondary"
								sx={{ fontStyle: "normal" }}
							>
								{income.description}
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
								sx={{ fontWeight: "bold", mb: "0.5rem" }}
							>
								Amount
							</Typography>
							<Typography variant="h6" color="text.primary">
								₹{income.amount.toFixed(2)}
							</Typography>
						</Grid>

						{/* Income Type */}
						<Grid item xs={12} sm={6}>
							<Typography
								variant="subtitle2"
								color="text.secondary"
								sx={{ fontWeight: "bold", mb: "0.5rem" }}
							>
								Income Type
							</Typography>
							<Typography
								variant="h6"
								color="text.primary"
								sx={{ textTransform: "capitalize" }}
							>
								{income.incomeType}
							</Typography>
						</Grid>

						{/* Category */}
						<Grid item xs={12} sm={6}>
							<Typography
								variant="subtitle2"
								color="text.secondary"
								sx={{ fontWeight: "bold", mb: "0.5rem" }}
							>
								Category
							</Typography>
							<Chip
								label={income.categoryId.name}
								color="primary"
								variant="outlined"
								sx={{
									fontWeight: "bold",
									fontSize: "0.9rem",
								}}
							/>
						</Grid>

						{/* Created At */}
						<Grid item xs={12} sm={6}>
							<Typography
								variant="subtitle2"
								color="text.secondary"
								sx={{ fontWeight: "bold", mb: "0.5rem" }}
							>
								Created At
							</Typography>
							<Typography variant="h6" color="text.primary">
								{new Date(income.createdAt).toLocaleString()}
							</Typography>
						</Grid>
					</Grid>
				</CardContent>
			</Card>

			{/* Confirmation Dialog for Deletion */}
			<ConfirmationDialog
				open={isDialogOpen}
				title="Delete Income"
				message="Are you sure you want to delete this income? This action cannot be undone."
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

export default IncomeScreen;
