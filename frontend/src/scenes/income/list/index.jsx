import FlexBetween from "../../../components/FlexBetween";
import React, { useState } from "react";
import Header from "../../../components/Header";
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
	Card,
	Grid,
	Tooltip,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Delete, Search } from "@mui/icons-material";
import {
	useGetAllCognitiveTriggersQuery,
	useGetAllIncomeQuery,
	useGetAllIncomeCategoriesQuery,
	useDeleteIncomesMutation,
} from "../../../state/api";
import { toast } from "react-toastify";
import LoadingIndicator from "../../../components/LoadingIndicator";
import { formatIncomeListData } from "../../../utils/formatterFunctions";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
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
	},
}));

const FilterCard = styled(Card)(({ theme }) => ({
	backgroundColor: "transparent", // Fully transparent
	padding: theme.spacing(2),
	borderRadius: "8px",
	boxShadow: "none", // Remove shadow for transparency
}));

const IncomeListScreen = () => {
	const theme = useTheme();
	const navigate = useNavigate();

	// states for dialogue box
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [selectedIncomeId, setSelectedIncomeId] = useState(null);

	const [selectedCategoryCode, setSelectedCategoryCode] = useState("");
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);
	const [searchInput, setSearchInput] = useState("");
	const [searchTerm, setSearchTerm] = useState("");
	const [paginationModel, setPaginationModel] = useState({
		page: 0,
		pageSize: 10,
	});

	const userId = JSON.parse(localStorage.getItem("userInfoExpensio"))?.id;

	const {
		data: cognitiveTriggersData,
		isLoading: isLoadingCognitiveTriggersData,
		isError: cognitiveError,
	} = useGetAllCognitiveTriggersQuery();

	const {
		data: categoriesData,
		isLoading: categoriesLoading,
		isError: categoriesError,
	} = useGetAllIncomeCategoriesQuery();

	const {
		data: incomesData,
		isLoading: incomesLoading,
		isError: incomesError,
		refetch,
	} = useGetAllIncomeQuery({
		userId,
		page: paginationModel.page + 1,
		page_size: paginationModel.pageSize,
		start_date: startDate?.toISOString(),
		end_date: endDate?.toISOString(),
		category_code: selectedCategoryCode,
		search: searchTerm || undefined,
	});

	const [deleteIncomes, { isLoading: isDeleting }] = useDeleteIncomesMutation();

	if (isLoadingCognitiveTriggersData || categoriesLoading || incomesLoading)
		return <AnimatedLoadingIndicator height={"500px"} />;

	if (cognitiveError || categoriesError || incomesError) {
		toast.error("Failed to load data. Please try again.");
		return null;
	}

	const handleCategoryChange = (event) => {
		const value = event.target.value;
		setSelectedCategoryCode(value === "" ? "" : value);
	};

	const handleSearchInputChange = (e) => {
		setSearchInput(e.target.value);
	};

	const handleKeyDown = (e) => {
		if (e.key === "Enter") {
			setSearchTerm(searchInput.trim());
		}
	};

	const handleRowClick = (params) => {
		const { id } = params.row;
		navigate(`/income/${id}`);
	};

	const handleDelete = async (id) => {
		// // Confirm deletion
		// if (window.confirm("Are you sure you want to delete this expense?")) {
		// 	try {
		// 		// Call the deleteExpenses mutation with an array containing the single ID
		// 		await deleteIncomes([id]).unwrap(); // 'unwrap' to handle fulfilled/rejected promises

		// 		// Show success notification
		// 		toast.success("Expense deleted successfully.");
		// 		refetch();

		// 		// Optionally, refetch expenses or rely on cache invalidation
		// 	} catch (error) {
		// 		// Handle errors
		// 		toast.error(error?.data?.message || "Failed to delete expense.");
		// 	}
		// }

		setSelectedIncomeId(id);
		setIsDialogOpen(true);
	};

	const handleConfirmDelete = async () => {
		if (!selectedIncomeId) return;

		try {
			// Call the deleteExpenses mutation with an array containing the single ID
			await deleteIncomes([selectedIncomeId]).unwrap(); // 'unwrap' to handle fulfilled/rejected promises

			// Show success notification
			toast.success("Income deleted successfully.");

			// Close the dialog
			setIsDialogOpen(false);

			// Clear the selected expense ID
			setSelectedIncomeId(null);

			refetch();

			// No need to manually refetch if invalidatesTags is set correctly
			// If you opted for manual refetching, uncomment the line below:
			// refetch();
		} catch (error) {
			// Handle errors
			toast.error(error?.data?.message || "Failed to delete Income.");
		}
	};

	const handleCancelDelete = () => {
		setIsDialogOpen(false);
		setSelectedIncomeId(null);
	};

	const incomesDatagridcolumns = [
		{
			field: "serial",
			headerName: "S.No",
			width: 90,
		},
		{
			field: "title",
			headerName: "Title",
			flex: 1,
			sortable: true,
		},
		{
			field: "categoryName",
			headerName: "Category",
			flex: 1,
			sortable: true,
		},
		{
			field: "amount",
			headerName: "Amount",
			flex: 0.5,
			sortable: true,
			valueFormatter: (params) => {
				return `₹${params.toLocaleString()}`;
			},
			align: "left",
			headerAlign: "left",
		},
		{
			field: "dateNtime",
			headerName: "Date",
			flex: 1,
			sortable: true,
		},
		{
			field: "actions",
			headerName: "Actions",
			flex: 0.5,
			sortable: false,
			filterable: false,
			renderCell: (params) => (
				<Tooltip title="Delete Income">
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
			),
		},
	];

	const formattedData = formatIncomeListData(incomesData.incomes);

	return (
		<Box
			m="1.5rem 2.5rem"
			sx={{ backgroundColor: theme.palette.background.default }}
		>
			<FlexBetween marginBottom="25px">
				<Header title="INCOME LIST" subtitle="Keep track of your income." />

				<Box>
					<Button
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
						EXPENSIO
					</Button>
				</Box>
			</FlexBetween>
			<FilterCard>
				<Grid container spacing={3} alignItems="center">
					<Grid item xs={12} md={6} lg={4}>
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								backgroundColor: "#545353",
								borderRadius: "8px",
								padding: "0.5rem 1rem",
							}}
						>
							<InputBase
								placeholder="Search..."
								value={searchInput}
								onChange={handleSearchInputChange}
								onKeyDown={handleKeyDown}
								sx={{
									color: theme.palette.text.primary,
									flex: 1,
								}}
							/>
							<IconButton onClick={() => setSearchTerm(searchInput.trim())}>
								<Search sx={{ color: theme.palette.text.primary }} />
							</IconButton>
						</Box>
					</Grid>

					<Grid item xs={12} md={6} lg={4}>
						<FormControl fullWidth variant="outlined">
							<InputLabel
								id="category-label"
								sx={{ color: theme.palette.text.primary }}
							>
								Category
							</InputLabel>
							<Select
								labelId="category-label"
								value={selectedCategoryCode}
								onChange={handleCategoryChange}
								label="Category"
								sx={{
									"& .MuiSelect-select": {
										color: theme.palette.text.primary,
									},
									"& .MuiOutlinedInput-notchedOutline": {
										borderColor: theme.palette.divider,
									},
									"&:hover .MuiOutlinedInput-notchedOutline": {
										borderColor: theme.palette.primary.main,
									},
									"& .MuiSvgIcon-root": {
										color: theme.palette.text.primary,
									},
									"& .MuiInputLabel-root": {
										color: theme.palette.text.primary,
									},
								}}
							>
								<MenuItem value="">All Categories</MenuItem>
								{categoriesData?.categories?.map((category) => (
									<MenuItem key={category.code} value={category.code}>
										{category.name}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Grid>

					<Grid item xs={12} md={6} lg={2}>
						<LocalizationProvider dateAdapter={AdapterDateFns}>
							<DatePicker
								label="Start Date"
								value={startDate}
								onChange={(newValue) => setStartDate(newValue)}
								renderInput={(params) => (
									<TextField
										{...params}
										fullWidth
										sx={{
											"& .MuiInputBase-root": {
												color: theme.palette.text.primary,
												backgroundColor: theme.palette.background.alt,
												borderRadius: "8px",
											},
											"& .MuiOutlinedInput-notchedOutline": {
												borderColor: theme.palette.divider,
											},
											"&:hover .MuiOutlinedInput-notchedOutline": {
												borderColor: theme.palette.primary.main,
											},
											"& .MuiSvgIcon-root": {
												color: theme.palette.text.primary,
											},
											"& .MuiInputLabel-root": {
												color: theme.palette.text.primary,
											},
										}}
									/>
								)}
							/>
						</LocalizationProvider>
					</Grid>

					<Grid item xs={12} md={6} lg={2}>
						<LocalizationProvider dateAdapter={AdapterDateFns}>
							<DatePicker
								label="End Date"
								value={endDate}
								onChange={(newValue) => setEndDate(newValue)}
								renderInput={(params) => (
									<TextField
										{...params}
										fullWidth
										sx={{
											"& .MuiInputBase-root": {
												color: theme.palette.text.primary,
												backgroundColor: theme.palette.background.alt,
												borderRadius: "8px",
											},
											"& .MuiOutlinedInput-notchedOutline": {
												borderColor: theme.palette.divider,
											},
											"&:hover .MuiOutlinedInput-notchedOutline": {
												borderColor: theme.palette.primary.main,
											},
											"& .MuiSvgIcon-root": {
												color: theme.palette.text.primary,
											},
											"& .MuiInputLabel-root": {
												color: theme.palette.text.primary,
											},
										}}
									/>
								)}
							/>
						</LocalizationProvider>
					</Grid>
				</Grid>
			</FilterCard>
			<Box
				marginTop="25px"
				height="80vh"
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
					loading={incomesLoading}
					rows={formattedData}
					getRowId={(row) => row.id}
					columns={incomesDatagridcolumns}
					rowCount={incomesData.total}
					pageSizeOptions={[5, 10, 25, 50, 100]}
					pagination
					paginationMode="server"
					paginationModel={paginationModel}
					onPaginationModelChange={setPaginationModel}
					disableSelectionOnClick
					autoHeight
					onRowClick={handleRowClick}
					// Remove getRowClassName since all rows have the same color
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

export default IncomeListScreen;
