import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import SummaryMarkdownDisplay from "../SummaryMarkdownDisplay";
import Header from "../Header";

const SummaryList = ({ financialSummary }) => {
	const theme = useTheme();
	return (
		<>
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

			<SummaryMarkdownDisplay markdown={financialSummary.behavioralInsights} />

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
					title="BENCHMARKING"
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
			<SummaryMarkdownDisplay markdown={financialSummary.benchmarking} />
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
					title="PERSONALITY INSIGHTS"
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

			<SummaryMarkdownDisplay markdown={financialSummary.personalityInsights} />
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
					title="PERSONALIZED RECOMMENDATION"
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
				markdown={financialSummary.personalizedRecommendations}
			/>
		</>
	);
};

export default SummaryList;
