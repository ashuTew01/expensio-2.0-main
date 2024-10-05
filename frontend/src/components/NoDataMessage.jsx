import React from "react";
import { Box, Typography } from "@mui/material"; // Import necessary components
import { useTheme } from "@mui/material/styles"; // Import useTheme hook
import { Warning } from "@mui/icons-material"; // Import an icon for warning

const NoDataMessage = ({ text }) => {
	const theme = useTheme();

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "row", // Align icon and text horizontally
				alignItems: "center",
				justifyContent: "center",
				height: "35rem", // Center vertically
				textAlign: "center",
			}}
		>
			<Warning
				sx={{ fontSize: 90, color: theme.palette.warning.main, mr: 2 }}
			/>{" "}
			{/* Icon with margin */}
			<Typography
				variant="h3" // Larger text size
				sx={{
					color: "white", // Change text color based on your theme
					// fontWeight: "bold",
					textAlign: "center",
					maxWidth: "600px", // Limit width for better readability
				}}
			>
				{text}
			</Typography>
		</Box>
	);
};

export default NoDataMessage;
