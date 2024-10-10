import React from "react";
import { Box, Typography, useTheme, Grid, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ExpenseCard from "../ExpenseCard";

const LatestExpenses = ({ latestExpenses }) => {
	const theme = useTheme();
	const navigate = useNavigate();

	const handleShowAll = () => {
		navigate("/expense/list");
	};

	return (
		<Box
			gridColumn="span 8"
			gridRow="span 3"
			overflow="auto"
			borderRadius="0.55rem"
			p="1.5rem"
			backgroundColor={theme.palette.background.alt}
		>
			<Box
				display="flex"
				justifyContent="space-between"
				alignItems="center"
				mb="1rem"
			>
				<Typography variant="h4" fontWeight="bold">
					Recent Expenses
				</Typography>
				<Button onClick={handleShowAll}>
					<Typography fontSize="0.8rem" color="#ffffff">
						View More
					</Typography>
				</Button>
			</Box>
			<Grid container spacing={2}>
				{latestExpenses && latestExpenses.length > 0 ? (
					latestExpenses.map((expense) => (
						<Grid item xs={12} sm={6} md={4} key={expense.id}>
							<ExpenseCard
								id={expense.id}
								title={expense.title}
								amount={expense.amount}
								type={expense.type}
								categoryName={expense.categoryName}
								cognitiveTriggers={expense.cognitiveTriggers}
								createdAt={expense.createdAt}
							/>
						</Grid>
					))
				) : (
					<Typography>No recent expenses.</Typography>
				)}
			</Grid>
		</Box>
	);
};

export default LatestExpenses;
