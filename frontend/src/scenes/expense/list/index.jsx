// src/scenes/expense/list/index.jsx

import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Added useNavigate
import { styled } from "@mui/material/styles";
import {
	Box,
	Button,
	useTheme,
	MenuItem,
	Select,
	FormControl,
	InputLabel,
	InputBase,
	IconButton,
	TextField,
	Tooltip, // For better UX on the delete button
} from "@mui/material";
import { Search, Delete } from "@mui/icons-material"; // Added Delete icon
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DataGrid } from "@mui/x-data-grid";
import { toast } from "react-toastify"; // For user feedback (optional)

import FlexBetween from "../../../components/FlexBetween";
import Header from "../../../components/Header";
import { CustomToolbar } from "../../../components/CustomToolBarMuiDataGrid";
import {
	useGetAllExpensesQuery,
	useGetAllCognitiveTriggersQuery,
	useGetAllExpenseCategoriesQuery,
	// Placeholder for delete query
	useDeleteExpensesMutation, // Uncomment when delete query is implemented
} from "../../../state/api";
import { formatExpenseListData } from "../../../utils/formatterFunctions";
import ErrorDisplay from "../../../components/error/ErrorDisplay";
import ConfirmationDialog from "../../../components/ConfirmationDialog";
import AnimatedLoadingIndicator from "../../../components/AnimatedLoadingIndicator";

// Styled components using styled API
const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
	border: "none",
	borderRadius: "8px",
	boxShadow: theme.shadows[5],
	"& .MuiDataGrid-cell": {
		borderBottom: "none",
		color: theme.palette.text.primary,
	},
	"& .MuiDataGrid-columnHeaders": {
		backgroundColor: theme.palette.secondary.main,
		color: theme.palette.common.white,
		fontSize: "16px",
		fontWeight: "bold",
		borderBottom: "none",
	},
	"& .MuiDataGrid-virtualScroller": {
		backgroundColor: theme.palette.background.paper,
	},
	"& .MuiDataGrid-footerContainer": {
		backgroundColor: theme.palette.background.default, // Set footer to background.default
		color: theme.palette.common.white,
		borderTop: "none",
	},
	"& .MuiDataGrid-toolbarContainer .MuiButton-text": {
		color: `${theme.palette.common.white} !important`,
	},
	// Set all rows to background.default
	"& .MuiDataGrid-row": {
		backgroundColor: theme.palette.background.default,
		"&:hover": {
			backgroundColor: theme.palette.background.alt, // Set hover color
		},
	},
}));

const ExpenseListScreen = () => {
	const theme = useTheme();
	const navigate = useNavigate(); // Initialize useNavigate

	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [selectedExpenseId, setSelectedExpenseId] = useState(null);

	// State variables
	const [searchInput, setSearchInput] = useState("");
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedCategoryCode, setSelectedCategoryCode] = useState("");
	const [selectedCognitiveTriggers, setSelectedCognitiveTriggers] = useState(
		[]
	);
	// Removed selectedMood state
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);
	const [paginationModel, setPaginationModel] = useState({
		page: 0,
		pageSize: 10,
	});

	// const userId = JSON.parse(localStorage.getItem("userInfoExpensio"))?.id;

	// Fetch data using RTK Query
	const {
		data: cognitiveTriggersData,
		isLoading: isLoadingCognitiveTriggersData,
		isError: cognitiveError,
	} = useGetAllCognitiveTriggersQuery();

	const {
		data: categoriesData,
		isLoading: categoriesLoading,
		isError: categoriesError,
	} = useGetAllExpenseCategoriesQuery();

	const {
		data: expensesData,
		isLoading: expensesLoading,
		isError: expensesError,
		refetch,
	} = useGetAllExpensesQuery({
		start_date: startDate ? startDate.toISOString() : null,
		end_date: endDate ? endDate.toISOString() : null,
		search: searchTerm,
		categoryCode: selectedCategoryCode,
		cognitiveTriggerCodes: selectedCognitiveTriggers,
		page: paginationModel.page + 1,
		pageSize: paginationModel.pageSize,
		id: null, // Assuming no single expense is being fetched
	});

	// Create a mapping from code to name for Cognitive Triggers
	const cognitiveTriggerMap = useMemo(() => {
		const map = {};
		cognitiveTriggersData?.cognitiveTriggers?.forEach((trigger) => {
			map[trigger.code] = trigger.name;
		});
		return map;
	}, [cognitiveTriggersData]);

	// console.log(selectedCognitiveTriggers);

	// Placeholder for delete mutation
	const [deleteExpenses, { isLoading: isDeleting }] =
		useDeleteExpensesMutation(); // Uncomment when delete query is implemented

	// Display loading indicator if any data is loading
	if (isLoadingCognitiveTriggersData || categoriesLoading || expensesLoading)
		return <AnimatedLoadingIndicator height={"500px"} />;

	// Handle errors
	if (cognitiveError || categoriesError || expensesError) {
		return (
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				// height="100vh"
			>
				<ErrorDisplay
					fontSize="25px"
					textColor="rgba(235, 87, 87, 255)"
					text="Error loading data. Please refresh the page."
				/>
			</Box>
		);
	}

	// Styling for background color
	const backgroundColorStyle = {
		backgroundColor: theme.palette.background.default,
	};

	// Handlers for input changes
	const handleCategoryChange = (event) => {
		const value = event.target.value;
		setSelectedCategoryCode(value === "" ? "" : value);
	};

	const handleCognitiveTriggerChange = (event) => {
		console.log(event);
		const {
			target: { value },
		} = event;
		if (value.includes("")) {
			// If "All" is selected, clear the cognitive triggers array
			setSelectedCognitiveTriggers([]);
		} else {
			// Otherwise, set the selected cognitive triggers
			setSelectedCognitiveTriggers(
				typeof value === "string" ? value.split(",") : value
			);
		}
	};

	const handleSearchInputChange = (e) => {
		setSearchInput(e.target.value);
	};

	const handleKeyDown = (e) => {
		if (e.key === "Enter") {
			setSearchTerm(searchInput.trim());
		}
	};

	const handleSearchClick = () => {
		setSearchTerm(searchInput.trim());
	};

	// Define DataGrid columns
	const Datagridcolumns = [
		{
			field: "serial",
			headerName: "S.No",
			width: 90,
		},
		{
			field: "title",
			headerName: "Title",
			flex: 1,
		},
		{
			field: "categoryName",
			headerName: "Category",
			flex: 1,
		},
		{
			field: "amount",
			headerName: "Amount",
			flex: 0.5,
			valueFormatter: (params) => {
				return `₹${params.toLocaleString()}`;
			},
			// renderCell: (params) => `$${params.value.toFixed(2)}`,
		},
		{
			field: "dateNtime",
			headerName: "Date Time",
			flex: 1,
		},
		{
			field: "cognitiveTriggers",
			headerName: "Cognitive Triggers",
			flex: 1,
			// renderCell: (params) => params.value.join(", "),
		},
		{
			field: "actions",
			headerName: "Actions",
			flex: 0.5,
			sortable: false,
			filterable: false,
			renderCell: (params) => {
				// console.log(params.row);
				if (params.row?.deletable === false) return null;
				return (
					<Tooltip title="Delete Expense">
						<IconButton
							color="error"
							onClick={(e) => {
								e.stopPropagation(); // Prevent row click
								handleDelete(params.id);
							}}
						>
							<Delete />
						</IconButton>
					</Tooltip>
				);
			},
		},
	];

	// Format data for DataGrid
	const formattedData = formatExpenseListData(expensesData.expenses);
	// console.log("Formatted Data for DataGrid:", formattedData);

	// Handle Delete Action
	const handleDelete = async (id) => {
		// // Confirm deletion
		// if (window.confirm("Are you sure you want to delete this expense?")) {
		// 	try {
		// 		// Call the deleteExpenses mutation with an array containing the single ID
		// 		await deleteExpenses([id]).unwrap(); // 'unwrap' to handle fulfilled/rejected promises

		// 		// Show success notification
		// 		toast.success("Expense deleted successfully.");
		// 		refetch();

		// 		// Optionally, refetch expenses or rely on cache invalidation
		// 	} catch (error) {
		// 		// Handle errors
		// 		toast.error(error?.data?.message || "Failed to delete expense.");
		// 	}
		// }
		setSelectedExpenseId(id);
		setIsDialogOpen(true);
	};

	const handleConfirmDelete = async () => {
		if (!selectedExpenseId) return;

		try {
			// Call the deleteExpenses mutation with an array containing the single ID
			await deleteExpenses([selectedExpenseId]).unwrap(); // 'unwrap' to handle fulfilled/rejected promises

			// Show success notification
			toast.success("Expense deleted successfully.");

			// Close the dialog
			setIsDialogOpen(false);

			// Clear the selected expense ID
			setSelectedExpenseId(null);

			refetch();

			// No need to manually refetch if invalidatesTags is set correctly
			// If you opted for manual refetching, uncomment the line below:
			// refetch();
		} catch (error) {
			// Handle errors
			toast.error(error?.data?.message || "Failed to delete expense.");
		}
	};

	const handleCancelDelete = () => {
		setIsDialogOpen(false);
		setSelectedExpenseId(null);
	};

	// Define mood options (removed as per user's instruction)
	// const moodData = ["Happy", "Neutral", "Regretful"]; // Removed

	return (
		<Box m="1.5rem 2.5rem 4rem 2.5rem">
			{/* Header Section */}
			<FlexBetween marginBottom="25px">
				<Header title="EXPENSE LIST" subtitle="Keep track of your finances." />
				<Box>
					<Button
						component={Link}
						to="/expense/add"
						variant="contained"
						sx={{
							backgroundColor: theme.palette.secondary.light,
							color: theme.palette.background.alt,
							fontSize: "14px",
							fontWeight: "bold",
							padding: "10px 20px",
							"&:hover": {
								backgroundColor: theme.palette.secondary.main,
							},
						}}
					>
						Add Expense
					</Button>
				</Box>
			</FlexBetween>

			<Box
				display="flex"
				flexWrap="wrap"
				gap="1rem"
				marginBottom="20px"
				alignItems="center"
			>
				{/* Search Bar */}
				<FlexBetween
					backgroundColor={theme.palette.background.alt}
					borderRadius="9px"
					gap="3px"
					p="0.5rem 1rem"
					flex={1}
					minWidth="300px"
				>
					<InputBase
						placeholder="Search Expenses..."
						value={searchInput}
						onChange={handleSearchInputChange}
						onKeyDown={handleKeyDown}
						fullWidth
					/>
					<IconButton onClick={handleSearchClick}>
						<Search />
					</IconButton>
				</FlexBetween>

				{/* Category Selector */}
				<FormControl
					variant="outlined"
					sx={{ flex: "1 1 150px", maxWidth: "150px" }}
				>
					<InputLabel id="category-label">Category</InputLabel>
					<Select
						sx={{ ...backgroundColorStyle }}
						labelId="category-label"
						value={selectedCategoryCode}
						onChange={handleCategoryChange}
						label="Category"
					>
						<MenuItem value="">All Categories</MenuItem>
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

				{/* Cognitive Triggers Selector */}
				<FormControl
					variant="outlined"
					sx={{ flex: "1 1 200px", maxWidth: "200px" }}
				>
					<InputLabel id="cognitive-triggers-label">
						Cognitive Triggers
					</InputLabel>
					<Select
						sx={{ ...backgroundColorStyle }}
						labelId="cognitive-triggers-label"
						multiple
						value={selectedCognitiveTriggers}
						onChange={handleCognitiveTriggerChange}
						label="Cognitive Triggers"
						renderValue={(selected) =>
							selected.length > 0
								? selected
										.map((code) => cognitiveTriggerMap[code] || code)
										.join(", ")
								: "All"
						}
					>
						<MenuItem value="">
							<em>All</em>
						</MenuItem>
						{isLoadingCognitiveTriggersData ? (
							<MenuItem disabled>Loading Cognitive Triggers...</MenuItem>
						) : (
							cognitiveTriggersData?.cognitiveTriggers?.map((type) => (
								<MenuItem key={type.code} value={type.code}>
									{type.name}
								</MenuItem>
							))
						)}
					</Select>
				</FormControl>

				{/* Start Date Picker */}
				<DatePicker
					label="Start Date"
					value={startDate}
					onChange={(newValue) => {
						setStartDate(newValue);
					}}
					renderInput={(params) => (
						<TextField
							{...params}
							variant="outlined"
							sx={{ flex: "1 1 150px", maxWidth: "100px" }}
						/>
					)}
				/>

				{/* End Date Picker */}
				<DatePicker
					label="End Date"
					value={endDate}
					onChange={(newValue) => {
						setEndDate(newValue);
					}}
					renderInput={(params) => (
						<TextField
							{...params}
							variant="outlined"
							sx={{ flex: "1 1 150px", maxWidth: "100px" }}
						/>
					)}
				/>
			</Box>

			{/* DataGrid Section */}
			<Box
				// margin="25px 0"
				// height="80vh"
				marginTop="35px"
				marginBottom="80px"
				height="auto"
				width="99%"
				sx={{
					"& .MuiDataGrid-root": {
						border: "none",
					},
					"& .MuiDataGrid-cell": {
						borderBottom: "none",
					},
					"& .MuiDataGrid-columnHeaders": {
						backgroundColor: theme.palette.secondary.main,
						color: theme.palette.common.white,
						borderBottom: "none",
					},
					"& .MuiDataGrid-virtualScroller": {
						backgroundColor: theme.palette.background.paper,
					},
					"& .MuiDataGrid-footerContainer": {
						backgroundColor: theme.palette.background.default, // Set footer to background.default
						color: theme.palette.common.white,
						borderTop: "none",
					},
					"& .MuiDataGrid-toolbarContainer .MuiButton-text": {
						color: `${theme.palette.common.white} !important`,
					},
				}}
			>
				<StyledDataGrid
					loading={expensesLoading}
					rows={formattedData}
					getRowId={(row) => row.id}
					columns={Datagridcolumns}
					rowCount={expensesData.total}
					pageSizeOptions={[5, 10, 25, 50, 100]}
					pagination
					paginationMode="server"
					paginationModel={paginationModel}
					onPaginationModelChange={setPaginationModel}
					autoHeight
					slots={{
						toolbar: CustomToolbar,
					}}
					// sx={{ mb: "2rem" }}
					onRowClick={(params) => navigate(`/expense/${params.id}`)} // Row click navigation
					components={{
						NoRowsOverlay: () => (
							<Box
								sx={{
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									height: "100%",
									color: theme.palette.text.secondary,
								}}
							>
								No income records found.
							</Box>
						),
					}}
				/>
			</Box>

			{/* Confirmation Dialog */}
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

export default ExpenseListScreen;
