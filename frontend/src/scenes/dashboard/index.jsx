import React from "react";
import FlexBetween from "../../components/FlexBetween";
import Header from "../../components/Header";
import {
	Box,
	Button,
	Typography,
	useTheme,
	useMediaQuery,
} from "@mui/material";
import { useGetAllExpensesQuery, useGetDasboardQuery } from "../../state/api";
import { useSelector } from "react-redux";
import BreakdownChart from "../../components/BreakdownChart";
import { DataGrid } from "@mui/x-data-grid";

const Dashboard = () => {
	const theme = useTheme();
	const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");

	const userId = JSON.parse(localStorage.getItem("userInfoExpensio"))?.id;

	const {
		data: dashboardData,
		isLoading: dashboardDataLoading,
		isError: dashboardDataError,
	} = useGetDasboardQuery();

	// console.log(dashboardData);

	const expensesData = [];
	const expensesLoading = [];

	// calculations to format data for pie chart of category
	const categoryTotals = {};
	dashboardData?.currentMonthExpenseFinancialData?.expenseCategories?.forEach(
		(expense) => {
			const { categoryName, totalAmountSpent } = expense;
			if (categoryName in categoryTotals) {
				categoryTotals[categoryName] += totalAmountSpent;
			} else {
				categoryTotals[categoryName] = totalAmountSpent;
			}
		}
	);

	// calculations to format data for pie chart of psychological type
	const psychologicalTotals = {};
	dashboardData?.currentMonthExpenseFinancialData?.cognitiveTriggers?.forEach(
		(expense) => {
			const { cognitiveTriggerName, totalAmountSpent } = expense;
			if (cognitiveTriggerName in psychologicalTotals) {
				psychologicalTotals[cognitiveTriggerName] += totalAmountSpent;
			} else {
				psychologicalTotals[cognitiveTriggerName] = totalAmountSpent;
			}
		}
	);

	// Helper function to format the latest expenses from dashboardData
	const formatLatestExpensesData = () => {
		return dashboardData?.latestExpenses?.map((expense) => ({
			id: expense._id,
			title: expense.expenseDetailsId.title,
			amount: expense.expenseDetailsId.amount,
			expenseType: expense.expenseDetailsId.expenseType,
			categoryName: expense.expenseDetailsId.categoryName,
			cognitiveTriggers:
				expense.expenseDetailsId.cognitiveTriggerNames.join(", "),
			createdAt: new Date(
				expense.expenseDetailsId.createdAt
			).toLocaleDateString(),
		}));
	};

	// Define the columns for the DataGrid
	const columns = [
		{ field: "id", headerName: "ID", flex: 1 },
		{ field: "title", headerName: "Title", flex: 1 },
		{
			field: "amount",
			headerName: "Amount",
			flex: 1,
			renderCell: (params) => `$${params.value.toFixed(2)}`,
		},
		{ field: "expenseType", headerName: "Expense Type", flex: 1 },
		{ field: "categoryName", headerName: "Category", flex: 1 },
		{ field: "cognitiveTriggers", headerName: "Cognitive Triggers", flex: 2 },
		{ field: "createdAt", headerName: "Created At", flex: 1 },
	];

	// Get the formatted latest expenses
	const latestExpenses = formatLatestExpensesData();
	// console.log(latestExpenses);

	// console.log(categoryTotals);

	return (
		<Box m="1.5rem 2.5rem">
			<FlexBetween>
				<Header title="DASHBOARD" subtitle="Keep track of your finances." />

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
				mt="20px"
				display="grid"
				gridTemplateColumns="repeat(12, 1fr)"
				gridAutoRows="160px"
				gap="30px"
				sx={{
					"& > div": { gridColumn: isNonMediumScreens ? undefined : "span 12" },
				}}
			>
				<Box
					gridColumn="span 4"
					gridRow="span 2"
					backgroundColor="transparent"
					p="1rem"
					borderRadius="0.55rem"
					display="flex"
					justifyContent="space-between"
				>
					<Box
						component="img"
						sx={{
							height: 330,
							width: 330,
							// maxHeight: { xs: 233, md: 167 },
							// maxWidth: { xs: 350, md: 250 },
						}}
						alt={"Love Earth"}
						src={"/dashboard.png"}
					/>
				</Box>
				<Box
					gridColumn="span 8"
					gridRow="span 2"
					backgroundColor="transparent"
					p="1rem"
					borderRadius="0.55rem"
					display="flex"
					flexDirection="column"
					mt="7rem"
				>
					<Box>
						<Typography variant="h1" sx={{ fontWeight: "bold" }}>
							Uncover Your Financial Story,
						</Typography>
						<Typography variant="h1" sx={{ fontWeight: "bold" }}>
							Shape Your Future
						</Typography>
						<Box height="10px"></Box>
					</Box>
					<Box width="38rem">
						<Typography variant="h4" sx={{ fontSize: "0.2 rem" }}>
							Empowering you to make informed decisions and achieve your
							financial dreams.
						</Typography>
					</Box>
				</Box>

				{/* category pie chart */}
				<Box
					gridColumn="span 4"
					gridRow="span 3"
					backgroundColor={theme.palette.background.alt}
					p="1.5rem"
					borderRadius="0.55rem"
				>
					<Typography
						variant="h2"
						sx={{
							color: theme.palette.secondary[100],
							fontWeight: "bold",
						}}
					>
						Monthly Expense by Category
					</Typography>
					<BreakdownChart categories={categoryTotals} isDashboard={true} />
					<Typography
						mt="15px"
						// p="0 0.6rem"
						fontSize="0.8rem"
						sx={{
							color: theme.palette.secondary[200],
							fontSize: "15px",
							textAlign: "center",
						}}
					>
						Breakdown of monthly expenses by Category in which they were
						generated.
					</Typography>
				</Box>

				{/* Psychological Pie Chart */}

				<Box
					gridColumn="span 6"
					gridRow="span 3"
					backgroundColor={theme.palette.background.alt}
					p="1.5rem"
					borderRadius="0.55rem"
				>
					<Typography
						variant="h2"
						sx={{
							color: theme.palette.secondary[100],
							fontWeight: "bold",
						}}
					>
						Monthly Expense by Cognitive Trigger
					</Typography>
					<BreakdownChart categories={psychologicalTotals} isDashboard={true} />
					<Typography
						p="0 0.6rem"
						fontSize="0.8rem"
						sx={{ color: theme.palette.secondary[200] }}
					>
						Breakdown of monthly expenses by Psychological Types in which they
						were generated.
					</Typography>
				</Box>

				<Box
					gridColumn="span 8"
					height="500px"
					sx={{
						"& .MuiDataGrid-root": {
							border: "none",
							borderRadius: "5rem",
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
							backgroundColor: theme.palette.background.alt,
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
						loading={dashboardDataLoading || !latestExpenses}
						getRowId={(row) => row.id}
						rows={latestExpenses || []}
						columns={columns}
					/>
				</Box>

				<Box gridColumn="span 4" gridRow="span 3"></Box>
			</Box>
		</Box>
	);
};

export default Dashboard;
