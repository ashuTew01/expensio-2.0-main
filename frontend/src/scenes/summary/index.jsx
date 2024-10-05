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
	useLazyGetSummaryQuery,
	useBuildSummaryMutation,
} from "../../state/summaryApi";
import FlexBetween from "../../components/FlexBetween";
import Header from "../../components/Header";
import SummaryList from "../../components/summaryList/SummaryList";

const SummaryScreen = () => {
	const theme = useTheme();
	const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");

	const [year, setYear] = useState(new Date().getFullYear());
	const [timePeriod, setTimePeriod] = useState("monthly"); // Default time period
	const [month, setMonth] = useState(new Date().getMonth() + 1); // Current month
	const [financialSummary, setFinancialSummary] = useState(null); // To store financial summary
	const [error, setError] = useState(null); // To handle error state

	// Lazy query for manual fetching of summary
	const [
		triggerGetSummary,
		{ data: summaryData, error: summaryError, isLoading: isLazyFetching },
	] = useLazyGetSummaryQuery();

	const [buildSummary, { isLoading: isBuildingSummary }] =
		useBuildSummaryMutation();

	// Handler for fetching the summary when button is clicked
	const handleGetSummary = () => {
		triggerGetSummary({ timePeriod, year, month }); // Manually trigger fetch
	};

	// Handle the Build Summary action if summary is unavailable
	const handleBuildSummary = async () => {
		const buildResponse = await buildSummary({ timePeriod, year, month });
		if (buildResponse.data?.message === "OK") {
			setFinancialSummary(buildResponse.data.summary); // Update the summary
			setError(null);
		}
	};

	// Handle both summaryError and summaryData changes
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
			</FlexBetween>

			{/* Loader for fetching or building summary */}
			{(isLazyFetching || isBuildingSummary) && (
				<Box mt="2rem" display="flex" justifyContent="center">
					<CircularProgress />
				</Box>
			)}

			{/* Display Summary */}
			{financialSummary && (
				<Box mt="2rem">
					<SummaryList financialSummary={financialSummary} />
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
			{!isLazyFetching &&
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
