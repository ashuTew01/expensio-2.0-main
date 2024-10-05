import FlexBetween from "../../../components/FlexBetween";
import React, { useState } from "react";
import Header from "../../../components/Header";
import { styled } from "@mui/material/styles";
import { Link } from "react-router-dom";
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
} from "@mui/material";
import { Search } from "@mui/icons-material";
import {
	useGetAllExpensesQuery,
	useGetAllCategoriesQuery,
	useGetAllCognitiveTriggersQuery,
	useGetAllIncomeQuery,
} from "../../../state/api";
import { toast } from "react-toastify";
import LoadingIndicator from "../../../components/LoadingIndicator";
import { formatIncomeListData } from "../../../utils/formatterFunctions";
import { DataGrid } from "@mui/x-data-grid";

// Styled components using styled API
const StyledTableHeader = styled(Box)(({ theme }) => ({
	backgroundColor: theme.palette.secondary.main,
	color: "white",
}));

const StyledHoverRow = styled(Box)(({ theme }) => ({
	"&:hover": {
		backgroundColor: theme.palette.secondary.main,
		cursor: "pointer",
		"& > *": {
			color: "white",
		},
	},
}));

const IncomeListScreen = () => {
	const theme = useTheme();

	const [selectedCategoryCode, setSelectedCategoryCode] = useState("");
	const [selectedType, setSelectedType] = useState("");
	const [selectedMood, setSelectedMood] = useState("");
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
	} = useGetAllCategoriesQuery();

	const {
		data: incomesData,
		isLoading: incomesLoading,
		isError: incomesError,
	} = useGetAllIncomeQuery({
		userId,
		page: paginationModel.page + 1,
		pageSize: paginationModel.pageSize,
	});

	if (isLoadingCognitiveTriggersData || categoriesLoading || incomesLoading)
		return <LoadingIndicator />;

	const backgroundColorStyle = {
		backgroundColor: theme.palette.background.default,
	};

	const handleCategoryChange = (event) => {
		const value = event.target.value;
		setSelectedCategoryCode(value === "" ? "" : value);
	};

	const handleTypeChange = (e) => {
		const value = e.target.value;
		setSelectedType(value === "" ? "" : value);
	};

	const handleMoodChange = (e) => {
		const value = e.target.value;
		setSelectedMood(value === "" ? "" : value);
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
			renderCell: (params) => params.value.length,
		},
		{
			field: "dateNtime",
			headerName: "Date Time",
			flex: 1,
		},
	];

	const formattedData = formatIncomeListData(incomesData.incomes);

	const moodData = ["Happy", "Neutral", "Regretful"];

	return (
		<Box m="1.5rem 2.5rem">
			<FlexBetween marginBottom="25px">
				<Header title="Income List" subtitle="Keep track of your income." />

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
					padding: "1rem",
					margin: "1rem",
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
							<MenuItem value="">None</MenuItem>
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
							<MenuItem value="">None</MenuItem>
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
							<MenuItem value="">None</MenuItem>
							{moodData?.map((mood) => (
								<MenuItem key={mood} value={mood}>
									{mood}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</Box>
			</Box>

			<Box
				margin="25px 0"
				height="80vh"
				sx={{
					"& .MuiDataGrid-root": {
						border: "none",
					},
					"& .MuiDataGrid-cell": {
						borderBottom: "none",
					},
					"& .MuiDataGrid-columnHeaders": {
						backgroundColor: theme.palette.background.alt,
						color: theme.palette.secondary[100],
						borderBottom: "none",
					},
					"& .MuiDataGrid-virtualScroller": {
						backgroundColor: theme.palette.primary.light,
					},
					"& .MuiDataGrid-footerContainer": {
						backgroundColor: theme.palette.background.alt,
						color: theme.palette.secondary[100],
						borderTop: "none",
					},
					"& .MuiDataGrid-toolbarContainer .MuiButton-text": {
						color: `${theme.palette.secondary[200]} !important`,
					},
				}}
			>
				<DataGrid
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
				/>
			</Box>
		</Box>
	);
};

export default IncomeListScreen;
