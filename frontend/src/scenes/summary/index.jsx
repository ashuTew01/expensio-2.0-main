import React, { useEffect, useState } from "react";
import {
	Box,
	Button,
	Typography,
	useTheme,
	useMediaQuery,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
} from "@mui/material";
import {
	useLazyGetSummaryQuery,
	useBuildSummaryMutation,
} from "../../state/summaryApi";
import FlexBetween from "../../components/FlexBetween";
import Header from "../../components/Header";
import SummaryList from "../../components/summary/SummaryList";
import Lottie from "lottie-react";
import "./index.css";

// Import Lottie animation JSON files
import loadingAnimation from "../../animations/loading.json";
import successAnimation from "../../animations/success.json";
import errorAnimation from "../../animations/error.json";
import buildLoadingAnimation from "../../animations/buildLoading.json";

const SummaryScreen = () => {
	const theme = useTheme();
	const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");

	const [year, setYear] = useState(new Date().getFullYear());
	const [timePeriod, setTimePeriod] = useState("monthly"); // Default time period
	const [month, setMonth] = useState(new Date().getMonth() + 1); // Current month
	const [financialSummary, setFinancialSummary] = useState(null); // To store financial summary
	const [error, setError] = useState(null); // To handle error state

	const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
	const [randomFact, setRandomFact] = useState("");
	const [displaySummary, setDisplaySummary] = useState(false);

	// New state variable to keep track of last fetched parameters
	const [lastFetchedParams, setLastFetchedParams] = useState({});

	const randomFacts = [
		"Did you know that saving just $5 a day can accumulate to $1,825 a year?",
		"Budgeting can help you save up to 20% more each month.",
		"Investing early can significantly increase your wealth over time.",
		// Add more facts as needed
	];

	// Lazy query for manual fetching of summary
	const [
		triggerGetSummary,
		{ data: summaryData, error: summaryError, isLoading: isLazyFetching },
	] = useLazyGetSummaryQuery();

	const [buildSummary, { isLoading: isBuildingSummary }] =
		useBuildSummaryMutation();

	// Automatically fetch summary on mount
	useEffect(() => {
		triggerGetSummary({ timePeriod, year, month });
		setLastFetchedParams({ timePeriod, year, month });
	}, []);

	// Handle fetching summary manually
	const handleGetSummary = () => {
		const currentParams = { timePeriod, year, month };
		if (
			lastFetchedParams.timePeriod === timePeriod &&
			lastFetchedParams.year === year &&
			lastFetchedParams.month === month
		) {
			// Parameters haven't changed; no need to fetch again
			return;
		}
		setDisplaySummary(false);
		setError(null);
		setShowSuccessAnimation(false);
		setFinancialSummary(null);
		setLastFetchedParams(currentParams);
		triggerGetSummary({ timePeriod, year, month });
	};

	// Handle the Build Summary action
	const handleBuildSummary = async () => {
		setDisplaySummary(false);
		setError(null);
		setShowSuccessAnimation(false);
		setFinancialSummary(null);
		// Pick a random fact
		setRandomFact(randomFacts[Math.floor(Math.random() * randomFacts.length)]);
		try {
			const buildResponse = await buildSummary({
				timePeriod,
				year,
				month,
			}).unwrap();
			if (buildResponse.message === "OK") {
				setFinancialSummary(buildResponse.summary); // Update the summary
				setError(null);
				setShowSuccessAnimation(true);
				// After success animation, display the summary
				setTimeout(() => {
					setShowSuccessAnimation(false);
					setDisplaySummary(true);
				}, 2000); // Adjust duration as needed
			} else {
				setError("ERROR");
			}
		} catch (err) {
			setError("ERROR");
		}
	};

	// Handle summary data and errors
	useEffect(() => {
		if (
			summaryError?.status === 404 &&
			summaryError?.data?.message === "UNAVAILABLE"
		) {
			// Handle the case when summary is unavailable (error 404)
			setShowSuccessAnimation(false);
			setError("UNAVAILABLE");
			setFinancialSummary(null);
		} else if (summaryData?.message === "OK") {
			// Handle the case when summary data is successfully fetched
			setFinancialSummary(summaryData.summary);
			setError(null);
			setShowSuccessAnimation(true);
			// After success animation, display the summary
			setTimeout(() => {
				setShowSuccessAnimation(false);
				setDisplaySummary(true);
			}, 2000); // Adjust duration as needed
		} else if (summaryError) {
			// Handle other errors
			setError("ERROR");
			setFinancialSummary(null);
		}
	}, [summaryError, summaryData]);
	return (
		<Box m="1.5rem 2.5rem">
			<FlexBetween sx={{ width: "100%", padding: "0rem 0" }}>
				{/* Left Section - Financial Summary */}
				<Box
					flexBasis="40%" // Enough space to fit the title on one line
					display="flex"
					flexDirection="column"
					justifyContent="center"
					alignItems="flex-start"
				>
					<Header
						title="FINANCIAL SUMMARY"
						subtitle="See your detailed relationship with money here."
						variant="h1"
					/>
				</Box>

				{/* Middle Section - Time Period, Month, Year, and Get Summary */}
				<Box
					flexBasis="50%" // Enough space for form controls to fit comfortably
					display="flex"
					justifyContent="center"
					alignItems="center"
					gap={2} // Adjust the gap between the form elements for clarity
					sx={{ flexWrap: "wrap" }} // Ensures responsiveness on smaller screens
				>
					<FormControl sx={{ minWidth: 120, borderRadius: "8px" }}>
						<InputLabel>Time Period</InputLabel>
						<Select
							value={timePeriod}
							onChange={(e) => setTimePeriod(e.target.value)}
							sx={{ borderRadius: "8px" }}
						>
							<MenuItem value="monthly">Monthly</MenuItem>
							<MenuItem value="last3months">Last 3 Months</MenuItem>
							{/* <MenuItem value="last6months">Last 6 Months</MenuItem> */}
						</Select>
					</FormControl>

					{timePeriod === "monthly" && (
						<>
							<FormControl sx={{ minWidth: 100, borderRadius: "8px" }}>
								<InputLabel>Year</InputLabel>
								<Select
									value={year}
									onChange={(e) => setYear(e.target.value)}
									sx={{ borderRadius: "8px" }}
								>
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

							<FormControl sx={{ minWidth: 100, borderRadius: "8px" }}>
								<InputLabel>Month</InputLabel>
								<Select
									value={month}
									onChange={(e) => setMonth(e.target.value)}
									sx={{ borderRadius: "8px" }}
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
						// color="success"
						onClick={handleGetSummary}
						sx={{
							padding: "0.5rem 1rem",
							fontSize: "0.875rem",
							borderRadius: "5px",
							marginTop: "5px",
							backgroundColor: "#2ae870",
							height: "3rem",
							transition: "transform 0.2s ease-in-out",
							"&:hover": {
								transform: "scale(1.05)",
								backgroundColor: "#1d8f46",
							},
						}}
					>
						<Typography color="#000000" fontWeight={"bold"}>
							Get Summary
						</Typography>
					</Button>
				</Box>

				{/* Right Section - Build Summary */}
				<Box
					flexBasis="10%" // Smaller section for Build Summary but not too small
					mt="1.5rem"
					textAlign="center"
					display="flex"
					flexDirection="column"
					justifyContent="center"
					alignItems="center"
					sx={{
						backgroundColor: theme.palette.background.alt,
						borderRadius: "10%",
					}}
					p="1rem"
				>
					<Typography
						variant="body2"
						color="textSecondary"
						sx={{ mb: "0.5rem" }}
					>
						Build a new Summary to make it fresh.
					</Typography>
					<Button
						variant="contained"
						color="secondary"
						onClick={handleBuildSummary}
						sx={{
							padding: "0.1rem 0.8rem",
							fontSize: "0.9rem",
							fontWeight: "bold",
							borderRadius: "5px",
							boxShadow: "0 3px 6px rgba(0, 0, 0, 0.15)",
							transition: "transform 0.2s ease-in-out",
							"&:hover": {
								transform: "scale(1.05)",
							},
						}}
					>
						Build
					</Button>
				</Box>
			</FlexBetween>

			{/* Render content based on state */}
			{(() => {
				if (isLazyFetching) {
					// Display loading animation when fetching summary
					return (
						<Box
							mt="2rem"
							display="flex"
							flexDirection="column"
							alignItems="center"
						>
							<Lottie
								animationData={loadingAnimation}
								style={{ width: 200, height: 200 }}
							/>
							<Typography variant="h6" color="textSecondary">
								Getting Your Summary...
							</Typography>
						</Box>
					);
				} else if (isBuildingSummary) {
					// Display build summary loading with random fact
					return (
						<Box
							mt="2rem"
							display="flex"
							flexDirection="column"
							alignItems="center"
						>
							{" "}
							<Typography
								variant="h4"
								align="center"
								sx={{
									color: "#f5f5f5", // Soft white, works well on a dark background
									// mt: "1.5rem", // Top margin for spacing
									// mb: "1rem",
									fontWeight: "bold", // Emphasize the text with boldness
									letterSpacing: "0.05rem", // Subtle letter spacing for better readability
									animation: "fadeIn 0.5s ease-in", // Apply a fade-in animation
								}}
							>
								Building your Summary! Please wait...
							</Typography>
							<Box height="10px"></Box>
							<Typography variant="h4">
								<span
									style={{
										fontWeight: "bold", // Emphasize the text with boldness
										letterSpacing: "0.05rem",
										color: "#e67e22", // Bright orange to highlight the action
										animation: "pulse 1.5s infinite", // Pulse effect to draw attention to action
									}}
								>
									{randomFact}
								</span>
							</Typography>
							<Lottie
								animationData={buildLoadingAnimation}
								style={{ width: 380, height: 380 }}
							/>
						</Box>
					);
				} else if (showSuccessAnimation) {
					// Display success animation
					return (
						<Box
							mt="2rem"
							display="flex"
							flexDirection="column"
							alignItems="center"
						>
							<Lottie
								animationData={successAnimation}
								style={{ width: 200, height: 200 }}
								loop={false}
							/>
							<Typography
								variant="h4"
								align="center"
								sx={{
									color: "#f5f5f5", // Soft white, works well on a dark background
									// mt: "1.5rem", // Top margin for spacing
									// mb: "1rem",
									fontWeight: "bold", // Emphasize the text with boldness
									letterSpacing: "0.05rem", // Subtle letter spacing for better readability
									animation: "fadeInPulse 0.5s", // Apply a fade-in animation
								}}
							>
								Summary Loaded Successfully!
							</Typography>
						</Box>
					);
				} else if (displaySummary && financialSummary) {
					// Display summary with animation
					return (
						<Box mt="2rem">
							<SummaryList financialSummary={financialSummary} />
						</Box>
					);
				} else if (error === "UNAVAILABLE") {
					// Handle unavailable summary
					return (
						<Box
							mt="2rem"
							display="flex"
							flexDirection="column"
							alignItems="center"
						>
							<Lottie
								animationData={errorAnimation}
								style={{
									width: 300,
									height: 300,
									animation: "fadeInPulse 0.3s",
								}}
							/>
							<Typography
								variant="h4"
								align="center"
								sx={{
									color: "#f5f5f5", // Soft white, works well on a dark background
									mb: "1.5rem", // Bottom margin for spacing
									mt: "1.5rem", // Top margin for spacing
									fontWeight: "bold", // Emphasize the text with boldness
									letterSpacing: "0.05rem", // Subtle letter spacing for better readability
									animation: "fadeInPulse 0.3s", // Apply a fade-in animation
								}}
							>
								The summary is either not available, or not fresh.
								<br />
								<span
									style={{
										color: "#e67e22", // Bright orange to highlight the action
										animation: "pulse 1.5s infinite", // Pulse effect to draw attention to action
									}}
								>
									Please click the build button to build the summary.
								</span>
							</Typography>
							{/* <Button
								variant="contained"
								color="secondary"
								onClick={handleBuildSummary}
							>
								Build Summary
							</Button> */}
						</Box>
					);
				} else if (error === "ERROR") {
					// Handle other errors
					return (
						<Box
							mt="2rem"
							display="flex"
							flexDirection="column"
							alignItems="center"
						>
							<Lottie
								animationData={errorAnimation}
								style={{ width: 200, height: 200 }}
							/>
							<Typography variant="h6" color="error" align="center">
								Unable to fetch summary. Please try again later.
							</Typography>
						</Box>
					);
				} else {
					return null;
				}
			})()}
		</Box>
	);
};

export default SummaryScreen;
