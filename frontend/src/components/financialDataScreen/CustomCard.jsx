import React, { useState } from "react"; // React and useState hook
import {
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	Collapse,
	Typography,
} from "@mui/material"; // Material UI components
import { useTheme } from "@mui/material/styles"; // useTheme hook for accessing theme

const CustomCard = ({ name, count, totalAmount }) => {
	const theme = useTheme();

	return (
		<Card
			sx={{
				backgroundImage: "none",
				backgroundColor: theme.palette.background.alt,
				borderRadius: "0.55rem",
				boxShadow: 3, // Adds a subtle shadow
				padding: "1.5rem", // Adds padding
				transition: "transform 0.3s", // Smooth transition for hover effect
				"&:hover": {
					transform: "scale(1.02)", // Slightly scales up on hover
				},
			}}
		>
			<CardContent>
				<Typography
					sx={{ fontSize: 20, fontWeight: "bold" }} // Increased font size and weight
					color={theme.palette.secondary[700]}
					gutterBottom
				>
					{name} {/* Moved categoryName to top */}
				</Typography>
				<Box height={5} /> {/* Adjusted height for spacing */}
				<Typography
					variant="h5"
					sx={{ color: theme.palette.primary[100], fontWeight: "bold" }} // Bolder font for total amount
				>
					Rs.{totalAmount.toFixed(2)} {/* Formatted total amount */}
				</Typography>
				<Box height={5} /> {/* Adjusted height for spacing */}
				<Typography
					sx={{ fontSize: 14, color: theme.palette.text.secondary }} // Smaller font for number of expenses
					variant="body2"
				>
					{count} Expenses
				</Typography>
			</CardContent>
		</Card>
	);
};

export default CustomCard;
