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
import { useGetIncomeFinancialDataMutation } from "../../state/api"; // Adjust the import path for your API
import Header from "../../components/Header"; // Adjust the import path for your Header component
import FlexBetween from "../../components/FlexBetween"; // Make sure to import your FlexBetween component if it's custom
import { useEffect } from "react";
import CustomCard from "../../components/financialDataScreen/CustomCard";
import { useTheme } from "@emotion/react";
import NoDataMessage from "../../components/NoDataMessage";
import AnimatedLoadingIndicator from "../../components/AnimatedLoadingIndicator";
import { useSelector } from "react-redux";
import ErrorDisplay from "../../components/error/ErrorDisplay";

const IncomeFinancialData = () => {
	const theme = useTheme();
	const isNonMobile = useMediaQuery("(min-width: 1000px)");
	const [year, setYear] = useState(new Date().getFullYear());
	const [month, setMonth] = useState(new Date().getMonth() + 1); // Current month
	const [getIncomeFinancialData, { isLoading, data, isError, error }] =
		useGetIncomeFinancialDataMutation();

	const { userInfo } = useSelector((state) => state.auth);

	useEffect(() => {
		const requestBody = {
			monthYearPairs: [
				{
					month,
					year,
				},
			],
		};

		// Fetching data
		getIncomeFinancialData(requestBody);
	}, [month, year, getIncomeFinancialData]);

	if (isError) {
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
					text={
						error?.data.error.message ||
						"Error loading data. Please refresh the page."
					}
				/>
			</Box>
		);
	}

	return (
		<Box m="1.5rem 2.5rem">
			<FlexBetween>
				<Header
					title="INCOME FINANCIAL DATA"
					subtitle="Analyze your overall income and sources."
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
			<Box mt="3rem"></Box>

			{isLoading && <AnimatedLoadingIndicator height={"500px"} />}

			{data && data.length === 0 && (
				<NoDataMessage text="No Incomes are available for this month. Start adding incomes to analyze them here." />
			)}

			{data && data.length > 0 && (
				<>
					<Box display="flex" flexDirection="row" alignItems={"center"}>
						<Box
							gridColumn="span 4"
							gridRow="span 2"
							backgroundColor="transparent"
							p="1rem"
							borderRadius="0.55rem"
							display="flex"
							justifyContent="space-between"
							alignItems="center"
						>
							<Box
								component="img"
								sx={{
									height: 300,
									width: 300,
									// maxHeight: { xs: 233, md: 167 },
									// maxWidth: { xs: 350, md: 250 },
								}}
								alt={"EXPENSE DATA"}
								src={"/income-data.png"}
							/>
						</Box>
						<Box width="2rem"></Box>
						<Box
							gridColumn="span 8"
							gridRow="span 2"
							backgroundColor="transparent"
							p="1rem"
							borderRadius="0.55rem"
							display="flex"
							flexDirection="column"
							// mt="7rem"
						>
							<Box>
								{/* Add spacing between elements */}
								<Box height="1.5rem"></Box>

								{/* Greeting message */}
								<Typography
									variant="h1"
									sx={{
										color: "#50a8fa", // Bright, attention-grabbing color for greeting
										fontWeight: "bold",
										textShadow: "2px 2px 8px rgba(0, 0, 0, 0.3)", // Add a subtle shadow for depth
									}}
								>
									Hello {userInfo.first_name}!
								</Typography>

								{/* Expenditure message */}
								<Typography
									variant="h1"
									sx={{
										fontSize: 28,
										color: "#ffffff", // Slightly smaller and clean color to focus attention on the number
										marginTop: "0.5rem",
									}}
								>
									You have earned a total of
								</Typography>

								{/* Money spent */}
								<Typography
									variant="h1"
									sx={{
										marginBottom: "0px",
										fontSize: 80,
										fontWeight: "bold",
										color: "#02d487", // Bold, bright color for emphasis
										textShadow: "3px 3px 10px rgba(0, 0, 0, 0.5)", // Larger shadow for emphasis
									}}
								>
									₹ {data[0].totalMoneyEarned}
								</Typography>

								{/* Expense count */}
								<Typography
									variant="h1"
									sx={{
										fontSize: 25,
										marginTop: "0rem",
										color: "#ffffff",
									}}
								>
									on the given month through{" "}
									<Box
										component="span"
										sx={{
											fontWeight: "bold",
											color: "#f5bd02", // Highlight the number of expenses with a bright yellow color
											fontSize: "32px", // Make the number stand out more
											textShadow: "2px 2px 5px rgba(0, 0, 0, 0.4)", // Add depth to the number
										}}
									>
										{data[0].totalIncomes} incomes.
									</Box>
								</Typography>

								<Box height="10px"></Box>
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
							title="CATEGORY ANALYSIS"
							subtitle="Analyze your sources of income!"
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
					<Box mt="20px">
						{/* Categories Section */}
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
								({ categoryName, numIncomes, totalAmountEarned }) => (
									<CustomCard
										key={categoryName} // Use a unique identifier for the key prop
										name={categoryName}
										count={numIncomes}
										totalAmount={totalAmountEarned}
										type="Income(s)"
									/>
								)
							)}
						</Box>
					</Box>
				</>
			)}
		</Box>
	);
};

export default IncomeFinancialData;
