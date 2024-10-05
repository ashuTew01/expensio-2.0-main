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
import LoadingIndicator from "../../components/LoadingIndicator";
import CustomCard from "../../components/financialDataScreen/CustomCard";
import { useTheme } from "@emotion/react";
import NoDataMessage from "../../components/NoDataMessage";

const IncomeFinancialData = () => {
	const theme = useTheme();
	const isNonMobile = useMediaQuery("(min-width: 1000px)");
	const [year, setYear] = useState(new Date().getFullYear());
	const [month, setMonth] = useState(new Date().getMonth() + 1); // Current month
	const [getIncomeFinancialData, { isLoading, data, error }] =
		useGetIncomeFinancialDataMutation();

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
		getIncomeFinancialData(requestBody);
	}, [month, year, getIncomeFinancialData]);

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

			{isLoading && <LoadingIndicator />}

			{data && data.length === 0 && (
				<NoDataMessage text="No Incomes are available for this month. Start adding incomes to analyze them here." />
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
								src={"/income-data.png"}
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
									Maximize Your Earnings,
								</Typography>
								<Typography variant="h1" sx={{ fontWeight: "bold" }}>
									Secure Your Future
								</Typography>
								<Box height="10px"></Box>
							</Box>
							<Box width="38rem">
								<Typography variant="h4" sx={{ fontSize: "0.2 rem" }}>
									Understand your income patterns and take control of your
									financial growth
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
