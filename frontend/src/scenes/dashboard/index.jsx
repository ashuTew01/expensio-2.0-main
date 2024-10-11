import React from "react";
import FlexBetween from "../../components/FlexBetween";
import Header from "../../components/Header";
import { Box, Button, useTheme, useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useGetDasboardQuery } from "../../state/api";
import LatestExpenses from "../../components/dashboard/LatestExpenses";
import LatestIncomes from "../../components/dashboard/LatestIncomes";
import BreakdownPieChart from "../../components/dashboard/BreakdownPieChart";
import Hero from "../../components/dashboard/Hero";
import BigTitle from "../../components/dashboard/BigTitle";
import DisplayBarGraph from "../../components/dashboard/DisplayBarGraph";
import AnimatedLoadingIndicator from "../../components/AnimatedLoadingIndicator";

const Dashboard = () => {
	const theme = useTheme();
	const navigate = useNavigate();
	const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");

	const {
		data: dashboardData,
		isLoading: dashboardDataLoading,
		isError: dashboardDataError,
	} = useGetDasboardQuery();

	if (dashboardDataLoading) return <AnimatedLoadingIndicator height="500px" />;

	// calculations to format data for pie chart of category
	const expenseCategoryTotals = {};
	dashboardData?.currentMonthExpenseFinancialData?.expenseCategories?.forEach(
		(expense) => {
			const { categoryName, totalAmountSpent } = expense;
			if (categoryName in expenseCategoryTotals) {
				expenseCategoryTotals[categoryName] += totalAmountSpent;
			} else {
				expenseCategoryTotals[categoryName] = totalAmountSpent;
			}
		}
	);

	const incomeCategoryTotals = {};
	dashboardData?.currentMonthIncomeFinancialData?.incomeCategories?.forEach(
		(income) => {
			const { categoryName, totalAmountEarned } = income;
			if (categoryName in incomeCategoryTotals) {
				incomeCategoryTotals[categoryName] += totalAmountEarned;
			} else {
				incomeCategoryTotals[categoryName] = totalAmountEarned;
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
			id: expense.expenseDetailsId?.expenseId,
			title: expense.expenseDetailsId?.title,
			amount: expense.expenseDetailsId?.amount,
			type: expense.expenseDetailsId?.expenseType,
			categoryName: expense.expenseDetailsId?.categoryName,
			cognitiveTriggers:
				expense.expenseDetailsId?.cognitiveTriggerNames.join(", "),
			createdAt: new Date(
				expense.expenseDetailsId?.createdAt
			).toLocaleDateString(),
		}));
	};

	const formatLatestIncomeData = () => {
		return dashboardData?.latestIncomes?.map((income) => ({
			id: income.incomeDetailsId?.incomeId,
			title: income.incomeDetailsId?.title,
			amount: income.incomeDetailsId?.amount,
			type: income.incomeDetailsId?.incomeType,
			categoryName: income.incomeDetailsId?.categoryName,
			createdAt: new Date(
				income.incomeDetailsId.createdAt
			).toLocaleDateString(),
		}));
	};

	const expenseCategoryDataForBarGraph =
		dashboardData?.currentMonthExpenseFinancialData?.cognitiveTriggers?.length >
		0
			? dashboardData?.currentMonthExpenseFinancialData?.expenseCategories?.map(
					(item, i) => ({
						category: item.categoryName,
						amountSpent: item.totalAmountSpent,
						expenses: item.numExpenses,
						color: theme.palette.secondary[((i % 9) + 1) * 100],
					})
				)
			: [];
	const incomeCategoryDataForBarGraph =
		dashboardData?.currentMonthIncomeFinancialData
			? dashboardData?.currentMonthIncomeFinancialData?.incomeCategories?.map(
					(item, i) => ({
						category: item.categoryName,
						amountSpent: item.totalAmountEarned,
						expenses: item.numIncomes,
						color: theme.palette.secondary[((i % 9) + 1) * 100],
					})
				)
			: [];

	const cognitiveTriggerForBarGraph =
		dashboardData?.currentMonthExpenseFinancialData?.cognitiveTriggers?.map(
			(item, i) => ({
				category: item.cognitiveTriggerName,
				amountSpent: item.totalAmountSpent,
				expenses: item.numExpenses,
				color: theme.palette.secondary[((i % 9) + 1) * 100],
			})
		);

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
	const latestIncomes = formatLatestIncomeData();

	const totalMoneyEarned =
		dashboardData?.currentMonthIncomeFinancialData?.totalMoneyEarned;
	const totalMoneySpent =
		dashboardData?.currentMonthExpenseFinancialData?.totalMoneySpent;
	// console.log(totalMoneyEarned, totalMoneySpent);
	return (
		<Box m="1.5rem 2.5rem">
			<FlexBetween>
				<Header title="DASHBOARD" subtitle="Keep track of your finances." />

				<Box>
					<Button
						variant="contained"
						sx={{
							backgroundColor: theme.palette.secondary.light,
							color: theme.palette.background.alt,
							fontSize: "12px",
							fontWeight: "bold",
							padding: "10px 20px",
							"&:hover": { backgroundColor: "#afafaf" },
						}}
						onClick={() => navigate("/user/expense-financial-data")}
					>
						Detailed Financial Data
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
				<Hero
					totalMoneyEarned={totalMoneyEarned}
					totalMoneySpent={totalMoneySpent}
				/>

				<BigTitle
					title="EXPENDITURE ANALYSIS"
					subtitle={"Analyze your spendings!"}
					titleFontColor={"#54cff7"}
				/>

				<BreakdownPieChart
					title="Category Breakdown"
					formattedData={expenseCategoryTotals}
					text={`Looking into where you spend most of your money, can help you keep your expenses in control.`}
				/>

				{/* Category Bar Graph */}
				<DisplayBarGraph
					title="Category Analysis"
					formattedData={expenseCategoryDataForBarGraph}
					yAxis="Amount Spent"
					currency="₹"
				/>

				<LatestExpenses latestExpenses={latestExpenses} />
				<BreakdownPieChart
					title="Understand Your Cognitive Triggers"
					formattedData={psychologicalTotals}
					text={`Knowing what causes you to spend the most, can help you control desires, and hence spendings.`}
				/>

				<BigTitle
					title="INCOME ANALYSIS"
					subtitle={"Understand you Income Sources!"}
					titleFontColor={"#55fa81"}
				/>
				<BreakdownPieChart
					title="Category Breakdown"
					formattedData={incomeCategoryTotals}
					text={`Multiplying Income Sources can help you stay ahead of 99% of people.`}
				/>
				<DisplayBarGraph
					title="Category Analysis"
					formattedData={incomeCategoryDataForBarGraph}
					yAxis="Amount Earned"
					currency="₹"
				/>
				<LatestIncomes latestIncomes={latestIncomes} />
			</Box>
		</Box>
	);
};

export default Dashboard;

// LEGACY
/* cognitive bar graph */
/* <Box
					gridColumn="span 8"
					gridRow="span 3"
					backgroundColor={theme.palette.background.alt}
					p="1.5rem"
					borderRadius="0.55rem"
				>
					<BarGraph
						isDashboard={true}
						formattedData={cognitiveTriggerForBarGraph}
					/>
				</Box> */
