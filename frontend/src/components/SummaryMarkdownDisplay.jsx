import React from "react";
import { Box, CircularProgress, Alert } from "@mui/material";
import { useTheme } from "@emotion/react";
import LoadingIndicator from "./LoadingIndicator";
import ShowMarkDown from "./ShowMarkDown";

const SummaryMarkdownDisplay = ({ markdown, isLoading, isError }) => {
	const theme = useTheme();
	if (isLoading) {
		return <LoadingIndicator />;
	}

	if (isError || !markdown) {
		return <Alert severity="error">Failed to load financial summary.</Alert>;
	}
	return (
		<>
			<Box
				sx={{
					backgroundColor: "none",
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
				<ShowMarkDown markdown={markdown}></ShowMarkDown>
			</Box>
		</>
	);
};

export default SummaryMarkdownDisplay;
