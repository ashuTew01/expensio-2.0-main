import React, { useState } from "react";
import {
	Box,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	useMediaQuery,
	Typography,
} from "@mui/material"; // Import necessary MUI components
import { useGetExpenseFinancialDataMutation } from "../../state/api"; // Adjust the import path for your API
import Header from "../../components/Header"; // Adjust the import path for your Header component
import FlexBetween from "../../components/FlexBetween"; // Make sure to import your FlexBetween component if it's custom
import { useEffect } from "react";
import LoadingIndicator from "../../components/LoadingIndicator";
import CustomCard from "../../components/financialDataScreen/CustomCard";
import { useTheme } from "@emotion/react";
import NoDataMessage from "../../components/NoDataMessage";

const ExpenseFinancialData = () => {
	const theme = useTheme();
	const isNonMobile = useMediaQuery("(min-width: 1000px)");
	const [year, setYear] = useState(new Date().getFullYear());
	const [month, setMonth] = useState(new Date().getMonth() + 1); // Current month
	const [getExpenseFinancialData, { isLoading, data, error }] =
		useGetExpenseFinancialDataMutation();

	// Effect to fetch financial data whenever month or year changes
	useEffect(() => {
		// Constructing the request body based on selected month and year
		const requestBody = {
			monthYearPairs: [
				{
					month,
					year,
				},
			],
		};

		// Fetching data
		getExpenseFinancialData(requestBody);
	}, [month, year, getExpenseFinancialData]);

	return (
		<Box m="1.5rem 2.5rem">
			<FlexBetween>
				<Header
					title="EXPENSE FINANCIAL DATA"
					subtitle="See where you're spending most of your money on."
					variant="h1"
				/>

				<Box mt="2rem">
					{/* Conditionally render month and year selectors based on timePeriod */}
					<FormControl sx={{ minWidth: 120, marginRight: "1rem" }}>
						<InputLabel>Year</InputLabel>
						<Select value={year} onChange={(e) => setYear(e.target.value)}>
							{Array.from({ length: 10 }, (_, i) => {
								const currentYear = new Date().getFullYear();
								return (
									<MenuItem key={i} value={currentYear - i}>
										{currentYear - i}
									</MenuItem>
								);
							})}
						</Select>
					</FormControl>

					<FormControl sx={{ minWidth: 120 }}>
						<InputLabel>Month</InputLabel>
						<Select value={month} onChange={(e) => setMonth(e.target.value)}>
							{Array.from({ length: 12 }, (_, i) => (
								<MenuItem key={i} value={i + 1}>
									{new Date(0, i).toLocaleString("default", {
										month: "long",
									})}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</Box>
			</FlexBetween>

			{isLoading && <LoadingIndicator />}

			{data && data.length === 0 && (
				<NoDataMessage text="No expenses are available for this month. Start adding expenses to analyze them here." />
			)}

			{data && data.length > 0 && (
				<>
					<Box display="flex" flexDirection="row">
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
								src={"/expense-data.png"}
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
									You have spent a total of ₹ {data[0].totalMoneySpent}
								</Typography>
								<Typography variant="h1" sx={{ fontWeight: "bold" }}>
									on {data[0].totalExpenses} expenses on selected date.
								</Typography>
								<Box height="10px"></Box>
							</Box>
							<Box width="38rem">
								<Typography variant="h4" sx={{ fontSize: "0.2 rem" }}>
									Gain insight into your spending habits and unlock the power to
									control your financial future.
								</Typography>
							</Box>
						</Box>
					</Box>
					<Box mt="5rem"></Box>

					<Box
						sx={{
							// backgroundColor: theme.palette.background.alt,
							borderRadius: "8px",
							p: "0.1rem",
							// boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
							// overflow: "hidden",
							gridColumn: "span 12", // occupies the full width
							gridRow: "span 4",
							overflow: "auto",
							"&::-webkit-scrollbar": {
								width: "6px",
							},
							"&::-webkit-scrollbar-track": {
								background: theme.palette.background.default,
							},
							"&::-webkit-scrollbar-thumb": {
								background: theme.palette.secondary.main,
								borderRadius: "3px",
							},
							mb: "2.5rem",
						}}
					>
						<Header
							title="COGNITIVE TRIGGER ANALYSIS"
							subtitle="See what causes you to spend the most!"
							variant="h2"
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
								// color: "blue",
							}}
							titleFontColor="#02d487"
						/>
					</Box>

					<Box mt="20px">
						{/* Cognitive Trigger Section */}

						<Box
							my="2rem"
							display="grid"
							gridTemplateColumns="repeat(4, minmax(0, 1fr))"
							justifyContent="space-between"
							rowGap="20px"
							columnGap="1.33%"
							sx={{
								"& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
							}}
						>
							{data[0].cognitiveTriggers.map(
								({ cognitiveTriggerName, numExpenses, totalAmountSpent }) => (
									<CustomCard
										key={cognitiveTriggerName}
										name={cognitiveTriggerName}
										count={numExpenses}
										totalAmount={totalAmountSpent}
										percentage={30}
									/>
								)
							)}
						</Box>
						<Box mt="5rem"></Box>
						<Box
							sx={{
								// backgroundColor: theme.palette.background.alt,
								borderRadius: "8px",
								p: "0.1rem",
								// boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
								// overflow: "hidden",
								gridColumn: "span 12", // occupies the full width
								gridRow: "span 4",
								overflow: "auto",
								"&::-webkit-scrollbar": {
									width: "6px",
								},
								"&::-webkit-scrollbar-track": {
									background: theme.palette.background.default,
								},
								"&::-webkit-scrollbar-thumb": {
									background: theme.palette.secondary.main,
									borderRadius: "3px",
								},
								mb: "2.5rem",
							}}
						>
							<Header
								title="CATEGORY ANALYSIS"
								subtitle="See where you spend the most money on!"
								variant="h2"
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "space-between",
									// color: "blue",
								}}
								titleFontColor="#7a7dff"
							/>
						</Box>

						{/* Categories Section */}
						{/* <Header title="Categories" variant="h4" style={{ mt: "2rem" }} /> */}
						<Box
							mt="20px"
							display="grid"
							gridTemplateColumns="repeat(4, minmax(0, 1fr))"
							justifyContent="space-between"
							rowGap="20px"
							columnGap="1.33%"
							sx={{
								"& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
							}}
						>
							{data[0].categories.map(
								({ categoryName, numExpenses, totalAmountSpent }) => (
									<CustomCard
										key={categoryName} // Use a unique identifier for the key prop
										name={categoryName}
										count={numExpenses}
										totalAmount={totalAmountSpent}
									/>
								)
							)}
						</Box>
						<Box mt="5rem"></Box>
						<Box
							sx={{
								// backgroundColor: theme.palette.background.alt,
								borderRadius: "8px",
								p: "0.1rem",
								// boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
								// overflow: "hidden",
								gridColumn: "span 12", // occupies the full width
								gridRow: "span 4",
								overflow: "auto",
								"&::-webkit-scrollbar": {
									width: "6px",
								},
								"&::-webkit-scrollbar-track": {
									background: theme.palette.background.default,
								},
								"&::-webkit-scrollbar-thumb": {
									background: theme.palette.secondary.main,
									borderRadius: "3px",
								},
								mb: "2.5rem",
							}}
						>
							<Header
								title="MOOD ANALYSIS"
								subtitle="How do you feel after spending money?"
								variant="h2"
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "space-between",
									// color: "blue",
								}}
								titleFontColor="#F5BD02"
							/>
						</Box>
						{/* Mood Section */}
						<Box
							mt="20px"
							display="grid"
							gridTemplateColumns="repeat(4, minmax(0, 1fr))"
							justifyContent="space-between"
							rowGap="20px"
							columnGap="1.33%"
							sx={{
								"& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
							}}
						>
							{data[0].moods.map(({ mood, numExpenses, totalAmountSpent }) => (
								<CustomCard
									key={mood}
									name={mood}
									count={numExpenses}
									totalAmount={totalAmountSpent}
								/>
							))}
						</Box>
					</Box>
				</>
			)}
		</Box>
	);
};

export default ExpenseFinancialData;
