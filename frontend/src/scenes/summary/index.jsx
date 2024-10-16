import React, { useEffect, useState } from "react";
import {
	Box,
	Button,
	Typography,
	useTheme,
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
	// const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");

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
		"Only 24% of Indians are financially literate, according to a Standard & Poor's survey.",
		"In India, around 90% of retail transactions are still cash-based, despite rapid growth in digital payments.",
		"Investing in mutual funds for at least 5 years reduces the risk of losses and increases potential returns.",
		"Public Provident Fund (PPF) is one of the safest long-term investment options, offering a tax-free interest rate.",
		"Sukanya Samriddhi Yojana (SSY) is a government-backed savings scheme that offers high interest rates for the girl child.",
		"The Indian government insures bank deposits up to ₹5 lakh per depositor through DICGC (Deposit Insurance and Credit Guarantee Corporation).",
		"A good credit score in India ranges from 750 to 900 and helps secure better interest rates on loans.",
		"Systematic Investment Plans (SIPs) allow you to invest in mutual funds starting from as low as ₹500 per month.",
		"The Indian stock market, represented by indices like BSE Sensex and NSE Nifty, is one of the oldest in Asia.",
		"Gold has historically been a hedge against inflation in India, and Gold ETFs (Exchange-Traded Funds) allow you to invest in gold digitally.",
		"India’s fiscal year runs from April 1st to March 31st, a system that helps align tax filings with the agricultural cycle.",
		"India has a robust real estate investment market, with REITs (Real Estate Investment Trusts) allowing people to invest in property indirectly.",
		"The Pradhan Mantri Jan Dhan Yojana (PMJDY) is the world’s largest financial inclusion scheme, with over 480 million accounts opened.",
		"ULIPs (Unit Linked Insurance Plans) combine both insurance and investment, offering tax benefits under Section 80C.",
		"In India, EPF (Employee Provident Fund) contributions are compulsory for salaried employees, and the current interest rate is around 8.5%.",
		"SEBI (Securities and Exchange Board of India) regulates the stock market and mutual funds to protect investors from fraud.",
		"India’s tax regime allows for deductions up to ₹1.5 lakh per annum under Section 80C for investments like ELSS, PPF, and NPS.",
		"The Reserve Bank of India (RBI) is the central bank, which manages inflation, monetary policy, and currency circulation.",
		"Credit card interest rates in India are among the highest in the world, sometimes exceeding 40% annually, making timely payments crucial.",
		"Rupee cost averaging, which occurs in SIP investments, helps lower the average cost per unit over time by spreading investments.",
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
						subtitle={
							<span>
								See your detailed relationship with money here. <br />
								(1 Summary Build ~ 0.7 - 1 AI Tokens){" "}
							</span>
						}
						variant="h1"
					/>
				</Box>

				{/* Middle Section - Time Period, Month, Year, and Get Summary */}
				<Box
					flexBasis="50%"
					display="flex"
					justifyContent="center"
					alignItems="center"
					gap={2}
					sx={{ flexWrap: "wrap" }}
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
					flexBasis="10%"
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
									color: "#f5f5f5",
									fontWeight: "bold",
									letterSpacing: "0.05rem",
									animation: "fadeIn 0.5s ease-in",
								}}
							>
								Building your Summary! Please wait...
							</Typography>
							<Box height="10px"></Box>
							<Typography variant="h4">
								<span
									style={{
										fontWeight: "bold",
										letterSpacing: "0.05rem",
										color: "#e67e22",
										animation: "pulse 1.5s infinite",
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
									color: "#f5f5f5",
									fontWeight: "bold",
									letterSpacing: "0.05rem",
									animation: "fadeInPulse 0.5s",
								}}
							>
								Summary Loaded Successfully!
							</Typography>
						</Box>
					);
				} else if (displaySummary && financialSummary) {
					return (
						<Box mt="2rem">
							<SummaryList financialSummary={financialSummary} />
						</Box>
					);
				} else if (error === "UNAVAILABLE") {
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
									color: "#f5f5f5",
									mb: "1.5rem",
									mt: "1.5rem",
									fontWeight: "bold",
									letterSpacing: "0.05rem",
									animation: "fadeInPulse 0.3s",
								}}
							>
								The summary is either not available, or not fresh.
								<br />
								<span
									style={{
										color: "#e67e22",
										animation: "pulse 1.5s infinite",
									}}
								>
									Please click the build button to build the summary.
								</span>
							</Typography>
						</Box>
					);
				} else if (error === "ERROR") {
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
