import React from "react";
import Header from "../Header";
import { useTheme, Box } from "@mui/material";

const BigTitle = ({ title, subtitle, titleFontColor = "#ffffff" }) => {
	const theme = useTheme();
	return (
		<>
			<Box
				display="flex"
				flexDirection="column"
				justifyContent="space-around"
				sx={{
					backgroundColor: theme.palette.background.alt,
					borderRadius: "8px",
					p: "2rem",
					gridColumn: "span 12", // occupies the full width
					gridRow: "span 0",
				}}
			>
				<Header
					title={title}
					subtitle={subtitle}
					variant="h2"
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

export default BigTitle;
