import React from "react"; // React
import {
	Box,
	Card,
	CardContent,
	CircularProgress,
	Typography,
} from "@mui/material"; // Material UI components
import { useTheme } from "@mui/material/styles"; // useTheme hook for accessing theme

const CustomCard = ({
	name,
	count,
	totalAmount,
	percentage,
	type = "Expense(s)",
}) => {
	const theme = useTheme();

	// Ensure that percentage is treated as a number
	const percentageValue = Number(percentage) || 0; // Fallback to 0 if percentage is not a valid number

	return (
		<Card
			sx={{
				backgroundColor: theme.palette.background.alt,
				borderRadius: "0.55rem",
				boxShadow: 3, // Adds a subtle shadow
				padding: "1rem", // Adds padding
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center", // Align items vertically in the center
				flexDirection: { xs: "column", sm: "row" }, // Responsive layout
				transition: "transform 0.3s", // Smooth transition for hover effect
				"&:hover": {
					transform: "scale(1.06)", // Slightly scales up on hover
				},
			}}
		>
			<CardContent sx={{ flex: 1 }}>
				<Typography
					sx={{ fontWeight: "bold" }} // Increased font size and weight
					variant="h4"
					color={theme.palette.secondary[400]}
					gutterBottom
				>
					{name} {/* Category Name */}
				</Typography>
				<Typography
					variant="h5"
					sx={{ color: theme.palette.primary[100], fontWeight: "bold" }} // Bolder font for total amount
				>
					₹ {totalAmount.toFixed(2)} {/* Formatted total amount */}
				</Typography>
				<Box mt={1} /> {/* Adjusted height for spacing */}
				<Typography
					sx={{ fontSize: 14, color: theme.palette.text.secondary }} // Smaller font for number of expenses
					variant="body2"
				>
					{count} {type}
				</Typography>
			</CardContent>

			<Box
				position="relative"
				display="flex"
				alignItems="center"
				justifyContent="center"
			>
				{/* Background Circular Progress (Light color) */}
				<CircularProgress
					variant="determinate"
					value={100} // Full circle for the background
					size={80}
					thickness={4}
					sx={{
						color: theme.palette.primary.main, // Light grey for the background circle
						position: "absolute",
					}}
				/>
				{/* Foreground Circular Progress (Blue progress) */}
				<CircularProgress
					variant="determinate"
					value={percentageValue}
					size={80}
					thickness={4}
					sx={{
						color: "#50a8fa", // Blue color for the actual progress
					}}
				/>
				{/* Percentage Display */}
				<Box
					position="absolute"
					display="flex"
					justifyContent="center"
					alignItems="center"
					sx={{
						width: "80px", // Match width of CircularProgress
						height: "80px", // Match height of CircularProgress
					}}
				>
					<Typography
						variant="h5"
						sx={{ fontWeight: "bold", color: theme.palette.text.primary }}
					>
						{percentageValue.toFixed(1)}% {/* Round percentage to 1 decimal */}
					</Typography>
				</Box>
			</Box>
		</Card>
	);
};

export default CustomCard;
