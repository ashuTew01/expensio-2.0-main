import React, { useState } from "react";
import FlexBetween from "../../../components/FlexBetween";
import {
	Box,
	Button,
	useTheme,
	Card,
	CardContent,
	Typography,
	useMediaQuery,
} from "@mui/material";
import Header from "../../../components/Header";
import { useGetExpenseByIdQuery } from "../../../state/api";
import { useParams } from "react-router-dom";
import OverviewBox from "../../../components/OverviewBox";
import LoadingIndicator from "../../../components/LoadingIndicator";

const ExpenseScreen = () => {
	const theme = useTheme();
	const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");

	const { id } = useParams();
	// console.log(id);
	// const [expenses, setExpenses] = useState([]);
	const {
		data,
		isLoading: isLoadingEvents,
		isError: eventsError,
	} = useGetExpenseByIdQuery({ id });

	// Handle loading and error states
	if (isLoadingEvents) return <LoadingIndicator />;
	if (eventsError) return <p>Error loading expenses.</p>;

	// Check if data is defined and has the expenses property
	if (!data || !data.expenses || data.expenses.length === 0)
		return <p>No expense data found.</p>;

	const expense = data.expenses[0];

	// const { title, amount, dateTime, mood, category, psychologicalType } =
	//   expense;

	// console.log(expense);

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
				mt="20px"
				display="grid"
				gridTemplateColumns="repeat(12, 1fr)"
				gridAutoRows="160px"
				gap="30px"
				sx={{
					"& > div": {
						gridColumn: isNonMediumScreens ? undefined : "span 12",
					},
				}}
			>
				<Box
					gridColumn="span 8"
					gridRow="span 2"
					// mt="20px"
					display="flex"
					flexDirection="column"
					// gridTemplateColumns="repeat(4, 1fr)" // Update to 4 columns
					// gridTemplateRows="repeat(2, auto)" // Update to 2 rows
					gap="20px"
				>
					{/* ROW 1 */}
					<OverviewBox expense={expense} rowSpan={2} colSpan={4} />
				</Box>
			</Box>
		</Box>
	);
};

export default ExpenseScreen;
