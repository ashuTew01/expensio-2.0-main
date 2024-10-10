import React from "react";
import { useTheme } from "@mui/material";
import Lottie from "lottie-react";
import loadingAnimation from "../animations/normalLoading.json";

const AnimatedLoadingIndicator = ({
	width = 200, // Default width for animation
	height = 200, // Default height for animation
	display = "block", // Default display type for animation
	hasText = false,
	text = "Loading...", // Default loading text
	textColor = "#ffffff", // Default text color
	fontSize = "1.25rem", // Default font size for the text
	textAlign = "center", // Default alignment for the text
	animationStyle = {}, // Additional styles for the animation container
	textStyle = {}, // Additional styles for the loading text
	animationLoop = true, // Controls whether the animation should loop
}) => {
	const theme = useTheme();
	const fadeInAnimation = {
		"@keyframes fadeInOut": {
			"0%": { opacity: 0 },
			"50%": { opacity: 1 },
			"100%": { opacity: 0 },
		},
	};
	return (
		<div
			style={{
				height: height,
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				...animationStyle, // Merge user-passed animation styles
			}}
		>
			{/* Lottie animation */}
			<Lottie
				animationData={loadingAnimation}
				loop={animationLoop} // Customizable animation loop
				style={{
					width: width,
					// height: height,
					display: display,
					margin: "0 auto",
				}}
			/>

			{/* Loading text */}
			{hasText && (
				<p
					style={{
						color: textColor, // Customizable text color
						fontSize: fontSize, // Customizable font size
						textAlign: textAlign, // Customizable text alignment
						marginTop: "1rem", // Spacing between animation and text
						animation: "fadeInOut 2s",
						...fadeInAnimation,
						...textStyle, // Merge user-passed text styles
					}}
				>
					{text}
				</p>
			)}
		</div>
	);
};

export default AnimatedLoadingIndicator;
