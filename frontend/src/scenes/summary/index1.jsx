// import React from "react";
// import { useGetUserSummaryQuery } from "state/api"; // Import the RTK Query hook
// import FlexBetween from "components/FlexBetween";
// import Header from "components/Header";
// import SummaryMarkdownDisplay from "components/SummaryMarkdownDisplay"; // Import the new component
// import {
// 	Box,
// 	Button,
// 	Typography,
// 	useTheme,
// 	useMediaQuery,
// } from "@mui/material";

// const SummaryScreen = () => {
// 	const theme = useTheme();
// 	const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
// 	const { data, isLoading, isError } = useGetUserSummaryQuery(); // Using the RTK Query hook

// 	return (
// 		<Box m="1.5rem 2.5rem">
// 			<FlexBetween>
// 				<Header
// 					title="FINANCIAL SUMMARY"
// 					subtitle="See your detailed relationship with money here."
// 				/>

// 				<Box>
// 					<Button
// 						sx={{
// 							backgroundColor: theme.palette.secondary.light,
// 							color: theme.palette.background.alt,
// 							fontSize: "14px",
// 							fontWeight: "bold",
// 							padding: "10px 20px",
// 						}}
// 					>
// 						EXPENSIO
// 					</Button>
// 				</Box>
// 			</FlexBetween>

// 			<Box
// 				mt="20px"
// 				display="grid"
// 				gridTemplateColumns="repeat(12, 1fr)"
// 				gridAutoRows="160px"
// 				gap="30px"
// 				sx={{
// 					"& > div": { gridColumn: isNonMediumScreens ? undefined : "span 12" },
// 				}}
// 			>
// 				<SummaryMarkdownDisplay
// 					data={data}
// 					isLoading={isLoading}
// 					isError={isError}
// 				/>
// 			</Box>
// 		</Box>
// 	);
// };

// export default SummaryScreen;
