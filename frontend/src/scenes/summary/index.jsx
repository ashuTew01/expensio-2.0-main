import React, { useEffect, useState } from "react";
import {
	Box,
	Button,
	Typography,
	useTheme,
	useMediaQuery,
	Select,
	MenuItem,
	CircularProgress,
	FormControl,
	InputLabel,
} from "@mui/material";
import {
	useGetSummaryQuery,
	useBuildSummaryMutation,
} from "../../state/summaryApi";
import FlexBetween from "../../components/FlexBetween";
import Header from "../../components/Header";
import SummaryMarkdownDisplay from "../../components/SummaryMarkdownDisplay";

const SummaryScreen = () => {
	const theme = useTheme();
	const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");

	const [year, setYear] = useState(new Date().getFullYear());
	const [timePeriod, setTimePeriod] = useState("monthly"); // Default time period
	const [month, setMonth] = useState(new Date().getMonth() + 1); // Current month
	const [financialSummary, setFinancialSummary] = useState(null); // To store financial summary
	const [error, setError] = useState(null); // To handle error state

	const {
		data: summaryData,
		error: summaryError,
		isLoading: isFetchingSummary,
		refetch,
	} = useGetSummaryQuery({ timePeriod, year, month });

	const [buildSummary, { isLoading: isBuildingSummary }] =
		useBuildSummaryMutation();

	// Handler for fetching the summary
	const handleGetSummary = () => {
		// setFinancialSummary(null);
		// setError(null);
		refetch(); // Trigger the query to fetch summary
	};

	// Handle the Build Summary action if summary is unavailable
	const handleBuildSummary = async () => {
		const buildResponse = await buildSummary({ timePeriod, year, month });
		if (buildResponse.data?.message === "OK") {
			setFinancialSummary(buildResponse.data.summary); // Update the summary
			setError(null);
		}
	};

	// useEffect to handle both summaryError and summaryData changes
	useEffect(() => {
		if (
			summaryError?.status === 404 &&
			summaryError?.data?.message === "UNAVAILABLE"
		) {
			// Handle the case when summary is unavailable (error 404)
			setError("UNAVAILABLE");
			setFinancialSummary(null);
		} else if (summaryData?.message === "OK") {
			// Handle the case when summary data is successfully fetched
			setFinancialSummary(summaryData.summary);
			setError(null);
		}
	}, [summaryError, summaryData]);

	return (
		<Box m="1.5rem 2.5rem">
			<FlexBetween>
				<Header
					title="FINANCIAL SUMMARY"
					subtitle="See your detailed relationship with money here."
					variant="h1"
				/>

				<Box mt="2rem">
					<FormControl sx={{ minWidth: 120, marginRight: "1rem" }}>
						<InputLabel>Time Period</InputLabel>
						<Select
							value={timePeriod}
							onChange={(e) => setTimePeriod(e.target.value)}
						>
							<MenuItem value="monthly">Monthly</MenuItem>
							<MenuItem value="last3months">Last 3 Months</MenuItem>
							<MenuItem value="last6months">Last 6 Months</MenuItem>
						</Select>
					</FormControl>

					{/* Conditionally render month and year selectors based on timePeriod */}
					{timePeriod === "monthly" && (
						<>
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
								<Select
									value={month}
									onChange={(e) => setMonth(e.target.value)}
								>
									{Array.from({ length: 12 }, (_, i) => (
										<MenuItem key={i} value={i + 1}>
											{new Date(0, i).toLocaleString("default", {
												month: "long",
											})}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</>
					)}

					<Button
						variant="contained"
						color="primary"
						onClick={handleGetSummary}
						sx={{ marginLeft: "1rem", marginTop: "10px" }}
					>
						Get Summary
					</Button>
				</Box>

				{/* <Box>
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
				</Box> */}
			</FlexBetween>

			{/* Loader for fetching or building summary */}
			{(isFetchingSummary || isBuildingSummary) && (
				<Box mt="2rem" display="flex" justifyContent="center">
					<CircularProgress />
				</Box>
			)}

			{/* Display Summary */}
			{financialSummary && (
				<Box mt="2rem">
					<Box
						sx={{
							backgroundColor: theme.palette.background.alt,
							borderRadius: "8px",
							p: "2rem",
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
						}}
					>
						<Header
							title="BEHAVIOURAL INSIGHTS"
							subtitle="See your financial spending behaviour!"
							variant="h2"
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
								// color: "blue",
							}}
							titleFontColor="#36da45"
						/>
					</Box>

					<SummaryMarkdownDisplay
						markdown={financialSummary.behavioralInsights}
					/>

					<Typography
						variant="h5"
						sx={{
							width: "100%",
							mt: "2rem",
							mb: "1rem",
							fontFamily: "'Roboto', sans-serif",
						}}
					>
						Benchmarking
					</Typography>
					<SummaryMarkdownDisplay markdown={financialSummary.benchmarking} />
					<Typography
						variant="h5"
						sx={{
							width: "100%",
							mt: "2rem",
							mb: "1rem",
							fontFamily: "'Roboto', sans-serif",
						}}
					>
						Personality Insights
					</Typography>
					<SummaryMarkdownDisplay
						markdown={financialSummary.personalityInsights}
					/>
					<Typography
						variant="h5"
						sx={{
							width: "100%",
							mt: "2rem",
							mb: "1rem",
							fontFamily: "'Roboto', sans-serif",
						}}
					>
						Personalized Recommendations
					</Typography>
					<SummaryMarkdownDisplay
						markdown={financialSummary.personalizedRecommendations}
					/>
				</Box>
			)}

			{/* Handle unavailable summary */}
			{error === "UNAVAILABLE" && (
				<Box mt="2rem">
					<Typography variant="h6" width="100%">
						Summary is unavailable. Would you like to build it?
					</Typography>
					<Button
						variant="contained"
						color="secondary"
						onClick={handleBuildSummary}
						sx={{ mt: "1rem" }}
					>
						Build Summary
					</Button>
				</Box>
			)}

			{/* Error or other cases */}
			{!isFetchingSummary &&
				!isBuildingSummary &&
				summaryError?.status === 404 && (
					<Box mt="2rem">
						<Typography variant="h6" color="error">
							Unable to fetch summary. Please try again later.
						</Typography>
					</Box>
				)}
		</Box>
	);
};

export default SummaryScreen;
