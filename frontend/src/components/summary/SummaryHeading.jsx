import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import Header from "../Header";

const SummaryHeading = ({
	title,
	subtitle,
	titleVariant = "h2",
	titleFontColor = "#36da45",
}) => {
	const theme = useTheme();
	return (
		<>
			<Box
				sx={{
					backgroundColor: theme.palette.background.alt,
					borderRadius: "8px",
					p: "2rem",
					gridColumn: "span 12",
					gridRow: "span 4",
					overflow: "auto",
				}}
			>
				<Header
					title={title}
					subtitle={subtitle}
					variant={titleVariant}
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
					}}
					titleFontColor={titleFontColor}
				/>
			</Box>
		</>
	);
};

export default SummaryHeading;
