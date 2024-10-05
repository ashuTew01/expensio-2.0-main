import React from "react"; // React
import {
	Box,
	Card,
	CardContent,
	CircularProgress,
	Typography,
} from "@mui/material"; // Material UI components
import { useTheme } from "@mui/material/styles"; // useTheme hook for accessing theme

const CustomCard = ({ name, count, totalAmount, percentage }) => {
	const theme = useTheme();

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
					{count} Expenses
				</Typography>
			</CardContent>

			<Box display="flex" alignItems="center" justifyContent="center">
				<CircularProgress
					variant="determinate"
					value={percentage}
					size={80} // Adjusted size for better responsiveness
					thickness={4}
					sx={{
						color: theme.palette.primary.main,
					}}
				/>
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
						{percentage}%
					</Typography>
				</Box>
			</Box>
		</Card>
	);
};

export default CustomCard;
