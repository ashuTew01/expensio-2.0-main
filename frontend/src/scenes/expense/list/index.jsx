import FlexBetween from "../../../components/FlexBetween";
import React, { useState } from "react";
import Header from "../../../components/Header";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
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
	Paper,
	TableCell,
	TableRow,
	TablePagination,
	TableBody,
	TableContainer,
	Table,
	TableHead,
	InputBase,
	IconButton,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import {
	useGetAllExpensesQuery,
	useGetAllCategoriesQuery,
	useGetAllEventsQuery,
	useGetAllCognitiveTriggersQuery,
} from "../../../state/api";
import { toast } from "react-toastify";
import LoadingIndicator from "../../../components/LoadingIndicator";

const useStyles = makeStyles((theme) => ({
	tableHeader: {
		backgroundColor: theme.palette.secondary,
		color: "white",
	},
	hoverRow: {
		"&:hover": {
			backgroundColor: theme.palette.secondary, // Change this to your desired hover color
			cursor: "pointer",
			"& > *": {
				color: "white", // Change this to your desired hover text color
			},
		},
	},
}));

const ExpenseListScreen = () => {
	const theme = useTheme();
	const classes = useStyles();

	const [selectedCategoryCode, setSelectedCategoryCode] = useState("");
	// const [selectedUserEvent, setSelectedUserEvent] = useState("");
	const [selectedType, setSelectedType] = useState("");
	const [selectedMood, setSelectedMood] = useState("");
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [page, setPage] = useState(0);

	const userId = JSON.parse(localStorage.getItem("userInfoExpensio"))?.id;

	// const {
	//   data: userEvents,
	//   isLoading: isLoadingEvents,
	//   isError: eventsError,
	// } = useGetAllEventsQuery();

	const {
		data: cognitiveTriggersData,
		isLoading: isLoadingCognitiveTriggersData,
		isError: cognitiveError,
	} = useGetAllCognitiveTriggersQuery();

	const {
		data: categoriesData,
		isLoading: categoriesLoading,
		isError: categoriesError,
	} = useGetAllCategoriesQuery();

	const {
		data: expensesData,
		isLoading: expensesLoading,
		isError: expensesError,
	} = useGetAllExpensesQuery({ userId, page, pageSize: rowsPerPage });

	// console.log(expensesData);

	if (isLoadingCognitiveTriggersData || categoriesLoading || expensesLoading)
		return <LoadingIndicator />;

	const backgroundColorStyle = {
		backgroundColor: theme.palette.background.default,
	};

	const handleCategoryChange = (event) => {
		// console.log("cat" + event.target.value);
		const value = event.target.value;
		setSelectedCategoryCode(value === "" ? "" : value);
	};

	// const handleUserEventChange = (event) => {
	//   // console.log("event" + event.target.value);
	//   const value = event.target.value;
	//   setSelectedUserEvent(value === "" ? "" : value);
	// };

	const handleTypeChange = (e) => {
		const value = e.target.value;
		setSelectedType(value === "" ? "" : value);
	};

	const handleMoodChange = (e) => {
		const value = e.target.value;
		setSelectedMood(value === "" ? "" : value);
	};

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};

	const columns = [
		{ id: "serialno", label: "Serial No.", minWidth: 120 },
		{ id: "title", label: "Title", minWidth: 120 },
		{ id: "category", label: "Category", minWidth: 120 },
		{ id: "amount", label: "Amount", minWidth: 120 },
		{ id: "dateTime", label: "Date Time", minWidth: 150 },
		{ id: "psychologicalType", label: "Psychological Type", minWidth: 150 },
		{ id: "mood", label: "Mood", minWidth: 120 },
	];

	const moodData = ["Happy", "Neutral", "Regretful"];

	return (
		<Box m="1.5rem 2.5rem">
			<FlexBetween>
				<Header title="Expense List" subtitle="Keep track of your finances." />

				<Box>
					<Button
						sx={{
							backgroundColor: theme.palette.secondary.light,
							color: theme.palette.background.alt,
							fontSize: "14px",
							fontWeight: "bold",
							padding: "10px 20px",
						}}
					>
						EXPENSIO
					</Button>
				</Box>
			</FlexBetween>

			<Box
				sx={{
					display: "flex",
					gap: "1.5rem",
					padding: "1 rem",
					margin: "1 rem",
				}}
			>
				<Box sx={{ width: "50%" }}>
					<FlexBetween
						backgroundColor={theme.palette.background.alt}
						borderRadius="9px"
						gap="3px"
						p="0.1rem 1.5rem"
					>
						<InputBase placeholder="Search..." />
						<IconButton>
							<Search />
						</IconButton>
					</FlexBetween>
				</Box>

				<Box sx={{ width: "50%" }}>
					<FormControl fullWidth variant="outlined">
						<InputLabel id="category-label">Category</InputLabel>
						<Select
							sx={{ ...backgroundColorStyle }}
							labelId="category-label"
							value={selectedCategoryCode}
							onChange={handleCategoryChange}
							label="Category"
						>
							<MenuItem value="">None</MenuItem> {/* Add this line */}
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
				</Box>
			</Box>

			<Box sx={{ display: "flex", gap: "1.5rem", padding: "1 rem" }}>
				<Box sx={{ width: "50%" }}>
					<FormControl fullWidth variant="outlined">
						<InputLabel id="type-label">Type</InputLabel>
						<Select
							sx={{ ...backgroundColorStyle }}
							labelId="type-label"
							value={selectedType}
							onChange={handleTypeChange}
							label="type"
						>
							<MenuItem value="">None</MenuItem> {/* Add this line */}
							{isLoadingCognitiveTriggersData ? (
								<MenuItem disabled>Loading Psychological types...</MenuItem>
							) : (
								cognitiveTriggersData?.cognitiveTriggers?.map((type) => (
									<MenuItem key={type._id} value={type.name}>
										{type.name}
									</MenuItem>
								))
							)}
						</Select>
					</FormControl>
				</Box>

				<Box sx={{ width: "50%" }}>
					<FormControl fullWidth variant="outlined">
						<InputLabel id="mood-label">Mood</InputLabel>
						<Select
							sx={{ ...backgroundColorStyle }}
							labelId="mood-label"
							value={selectedMood}
							onChange={handleMoodChange}
							label="Mood"
						>
							{/* {categoriesLoading ? (
                <MenuItem disabled>Loading Mood...</MenuItem>
              ) : ( */}
							<MenuItem value="">None</MenuItem> {/* Add this line */}
							{moodData?.map((mood) => (
								<MenuItem key={mood} value={mood}>
									{mood}
								</MenuItem>
							))}
							{/* )} */}
						</Select>
					</FormControl>
				</Box>
			</Box>

			<Box sx={{ margin: "2 rem" }}>
				<Paper sx={{ margin: "2 rem", width: "90%", overflow: "hidden" }}>
					<TableContainer sx={{ maxHeight: 580 }}>
						<Table stickyHeader aria-label="sticky table">
							<TableHead>
								<TableRow>
									{columns?.map((column) => (
										<TableCell
											className={classes.tableHeader}
											key={column.id}
											align="center" // Adjust alignment as per requirement
											style={{ minWidth: column.minWidth }}
										>
											{column.label}
										</TableCell>
									))}
								</TableRow>
							</TableHead>
							<TableBody>
								{expensesData?.expenses
									.filter((expense) =>
										selectedCategoryCode
											? expense.categoryId.code === selectedCategoryCode
											: true
									)
									.filter((expense) =>
										selectedMood
											? expense.mood === selectedMood.toLowerCase()
											: true
									)
									.filter((expense) =>
										selectedType
											? expense?.cognitiveTriggerIds?.length > 0 &&
												expense?.cognitiveTriggerIds[0]?.name === selectedType
											: true
									)
									?.map((val, index) => (
										<TableRow
											className={classes.hoverRow}
											role="checkbox"
											tabIndex={-1}
											key={val._id}
										>
											<TableCell
												onClick={() => {}} // Placeholder onClick function
												style={backgroundColorStyle}
												className={classes.hoverCell}
												key="serialno" // Assigning a key to serial number column
												align="center" // Adjust alignment as per requirement
											>
												{index + 1}
											</TableCell>
											{columns?.slice(1)?.map((column) => (
												<TableCell
													onClick={() => {}} // Placeholder onClick function
													style={backgroundColorStyle}
													className={classes.hoverCell}
													key={column.id}
													align="center" // Adjust alignment as per requirement
												>
													{column.id === "category" ? (
														val.categoryId.name
													) : column.id === "psychologicalType" ? (
														val?.cognitiveTriggerIds?.length > 0 ? (
															val.cognitiveTriggerIds[0]?.name
														) : (
															""
														)
													) : column.id === "dateTime" ? (
														new Date(val.createdAt).toLocaleString()
													) : (
														<Link
															to={`/expense/${val._id}`}
															style={{
																textDecoration: "none",
																color: "inherit",
															}}
														>
															{val[column.id]}
														</Link>
													)}
												</TableCell>
											))}
										</TableRow>
									))}
							</TableBody>
						</Table>
					</TableContainer>
					<TablePagination
						rowsPerPageOptions={[10, 20, 30, 50]}
						component="div"
						count={expensesData?.total ?? 0}
						rowsPerPage={rowsPerPage}
						page={page}
						onPageChange={handleChangePage}
						onRowsPerPageChange={handleChangeRowsPerPage}
					/>
				</Paper>
			</Box>
		</Box>
	);
};

export default ExpenseListScreen;
