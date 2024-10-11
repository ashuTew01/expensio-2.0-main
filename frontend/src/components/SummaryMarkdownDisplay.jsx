import React from "react";
import { Box, Alert } from "@mui/material";
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
					gridColumn: "span 12",
					gridRow: "span 4",
					overflow: "auto",
				}}
			>
				<ShowMarkDown markdown={markdown}></ShowMarkDown>
			</Box>
		</>
	);
};

export default SummaryMarkdownDisplay;
