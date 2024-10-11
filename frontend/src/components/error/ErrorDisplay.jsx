// src/components/ErrorDisplay.jsx

import React from "react";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import { Box, Typography, Button } from "@mui/material";
import Lottie from "lottie-react";
import errorAnimation from "../../animation/errorDisplayComponent.json"; // Ensure this path is correct

const ErrorDisplay = ({
	width = 250, // Width of the animation
	height = 300, // Height of the animation
	display = "flex", // CSS display property
	justifyContent = "center",
	flexDirection = "column",
	hasText = true, // Whether to display text
	text = "An unexpected error occurred.", // Default error message
	textColor, // Color of the text
	fontSize = "1.25rem", // Font size of the text
	textAlign = "center", // Text alignment
	animationStyle = {}, // Additional styles for the animation container
	textStyle = {}, // Additional styles for the text
	animationLoop = true, // Controls whether the animation should loop
	retry = false, // Whether to show a retry button
	onRetry = () => {}, // Function to call on retry
}) => {
	const theme = useTheme();

	return (
		<Box
			display="flex"
			flexDirection="column"
			alignItems="center"
			justifyContent="center"
			sx={{
				height: "500px", // Set the height to full viewport height to center it vertically
				width: "100%", // Full width
				backgroundColor: theme.palette.background.default,
				padding: "2rem",
				boxSizing: "border-box",
				...animationStyle, // Merge user-passed animation styles
			}}
		>
			{/* Lottie Animation */}
			<Lottie
				animationData={errorAnimation}
				loop={animationLoop}
				style={{
					width: width,
					height: height,
					display: display,
					margin: "0 auto", // Centers the animation horizontally
				}}
			/>

			{/* Error Text */}
			{hasText && (
				<Typography
					variant="h6"
					component="p"
					fontWeight="bold"
					sx={{
						color: textColor || theme.palette.error.main, // Default to error color
						fontSize: fontSize,
						textAlign: textAlign,
						marginTop: "1rem",
						...textStyle, // Merge user-passed text styles
					}}
				>
					{text}
				</Typography>
			)}

			{/* Retry Button */}
			{retry && (
				<Button
					variant="contained"
					color="error"
					onClick={onRetry}
					sx={{
						marginTop: "1.5rem",
						padding: "0.5rem 1.5rem",
						fontSize: "1rem",
						textTransform: "none",
					}}
				>
					Retry
				</Button>
			)}
		</Box>
	);
};

ErrorDisplay.propTypes = {
	width: PropTypes.number,
	height: PropTypes.number,
	display: PropTypes.string,
	hasText: PropTypes.bool,
	text: PropTypes.string,
	textColor: PropTypes.string,
	fontSize: PropTypes.string,
	textAlign: PropTypes.string,
	animationStyle: PropTypes.object,
	textStyle: PropTypes.object,
	animationLoop: PropTypes.bool,
	retry: PropTypes.bool,
	onRetry: PropTypes.func,
};

export default ErrorDisplay;
