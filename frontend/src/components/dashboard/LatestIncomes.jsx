import React from "react";
import { Box, Typography, useTheme, Grid, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ExpenseCard from "../ExpenseCard";

const LatestIncomes = ({ latestIncomes }) => {
	const theme = useTheme();
	const navigate = useNavigate();

	const handleShowAll = () => {
		navigate("/income/list");
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
					Recent Incomes
				</Typography>
				<Button onClick={handleShowAll}>
					<Typography fontSize="0.8rem" color="#ffffff">
						View More
					</Typography>
				</Button>
			</Box>
			<Grid container spacing={2}>
				{latestIncomes && latestIncomes.length > 0 ? (
					latestIncomes.map((income) => (
						<Grid item xs={12} sm={6} md={4} key={income.id}>
							<ExpenseCard
								id={income.id}
								title={income.title}
								amount={income.amount}
								type={income.type}
								categoryName={income.categoryName}
								cognitiveTriggers={income.cognitiveTriggers}
								createdAt={income.createdAt}
								cardType="income"
							/>
						</Grid>
					))
				) : (
					<Typography>No recent Incomes.</Typography>
				)}
			</Grid>
		</Box>
	);
};

export default LatestIncomes;
