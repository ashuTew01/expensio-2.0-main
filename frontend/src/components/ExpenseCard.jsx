import React from "react";
import {
	Card,
	CardContent,
	Grid,
	Typography,
	IconButton,
	useTheme,
	Box,
	Divider,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useNavigate } from "react-router-dom";

const ExpenseCard = ({
	id,
	title,
	amount,
	type,
	categoryName,
	cognitiveTriggers,
	createdAt,
}) => {
	console.log(categoryName);
	const theme = useTheme();
	const navigate = useNavigate();

	// Helper function to lighten a color
	const lightenColor = (color, amount) => {
		// Adjusts a hex color's brightness
		const rgb = color.replace(
			/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i,
			(_, r, g, b) => {
				const rValue = parseInt(r, 16),
					gValue = parseInt(g, 16),
					bValue = parseInt(b, 16);
				return `#${(
					(1 << 24) +
					(Math.round((rValue + amount) * 255) << 16) +
					(Math.round((gValue + amount) * 255) << 8) +
					Math.round((bValue + amount) * 255)
				)
					.toString(16)
					.slice(1)}`;
			}
		);
		return rgb;
	};

	// Custom styles for the card
	const cardStyles = {
		root: {
			backgroundColor: theme.palette.background.alt, // Light background\
			width: "90%",
			display: "flex",
			flexDirection: "column",
			borderRadius: theme.shape.borderRadius, // Rounded corners
			boxShadow: theme.shadows[2],
			transition: "transform 0.3s ease", // Subtle hover effect
			padding: theme.spacing(1),
			marginBottom: theme.spacing(1), // Margin between cards
			"&:hover": {
				transform: "scale(1.02)", // Slight scale on hover
			},
		},
		header: {
			display: "flex",
			justifyContent: "space-between",
			alignItems: "center",
		},
		amount: {
			color: theme.palette.success.main,
			fontWeight: 600,
			fontSize: "2",
		},
		type: {
			backgroundColor: lightenColor(theme.palette.primary.light, 0.1),
			color: theme.palette.primary.contrastText,
			padding: theme.spacing(0.5, 1),
			borderRadius: theme.shape.borderRadius,
			fontSize: "0.875rem",
			textTransform: "uppercase",
		},
		content: {
			paddingTop: theme.spacing(1),
		},
		info: {
			display: "flex",
			justifyContent: "space-between",
			marginTop: theme.spacing(1),
			fontSize: "0.875rem",
			color: theme.palette.text.secondary,
		},
		cognitiveTriggers: {
			color: theme.palette.info.main,
		},
		readMore: {
			display: "flex",
			alignItems: "center",
			justifyContent: "flex-end",
			// marginTop: theme.spacing(2),
			color: theme.palette.primary.main,
			fontWeight: "bold",
		},
		date: {
			fontWeight: "bold",
		},
	};

	const handleCardClick = () => {
		navigate(`/expense/${id}`);
	};

	return (
		<Grid container item xs={12}>
			<Card sx={cardStyles.root} onClick={handleCardClick}>
				{/* Cognitive Triggers and Other Info */}
				<CardContent sx={cardStyles.content}>
					{/* Header: Title and Expense Type */}
					<Box sx={cardStyles.header}>
						<Typography variant="h6" sx={{ fontWeight: "bold" }}>
							{title}
						</Typography>
						<Box sx={cardStyles.type}>{type}</Box>
					</Box>

					{/* Amount Display */}
					<Typography variant="h1" sx={cardStyles.amount}>
						₹{amount}
					</Typography>
					{/* Cognitive Triggers */}
					<Typography variant="body2" sx={cardStyles.cognitiveTriggers}>
						{cognitiveTriggers}
					</Typography>

					<Divider sx={{ my: 2 }} />

					{/* Category and Date */}
					<Box sx={cardStyles.info}>
						<Typography variant="body2">{categoryName}</Typography>
						<Typography variant="body2" sx={cardStyles.date}>
							{new Date(createdAt).toLocaleDateString()} -{" "}
							{new Date(createdAt).toLocaleTimeString([], {
								hour: "2-digit",
								minute: "2-digit",
							})}
						</Typography>
					</Box>
				</CardContent>

				{/* Read More Section */}
				<Box sx={cardStyles.readMore}>
					<Typography variant="body1">View Details</Typography>
					<IconButton>
						<ArrowForwardIosIcon />
					</IconButton>
				</Box>
			</Card>
		</Grid>
	);
};

export default ExpenseCard;
