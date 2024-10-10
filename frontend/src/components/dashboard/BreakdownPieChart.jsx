import React from "react";
import { useTheme, Box, Typography } from "@mui/material";
import BreakdownChart from "../BreakdownChart";

const BreakdownPieChart = ({ title, formattedData, text }) => {
	const theme = useTheme();
	// const text =
	// 	type === "expense"
	// 		? `Looking into where you spend most of your money, can help you keep your expenses in control.`
	// 		: `Multiplying Income Sources can help you stay ahead of 99% of people.`;
	return (
		<>
			<Box
				gridColumn="span 4"
				gridRow="span 3"
				backgroundColor={theme.palette.background.alt}
				p="1.5rem"
				borderRadius="0.55rem"
			>
				<Box display="flex" justifyContent="space-around">
					<Typography variant="h3" fontWeight={"bold"}>
						{title}
					</Typography>
				</Box>
				<BreakdownChart categories={formattedData} isDashboard={true} />
				<Typography
					mt="15px"
					// p="0 0.6rem"
					fontSize="0.8rem"
					sx={{
						color: theme.palette.secondary[200],
						fontSize: "15px",
						textAlign: "center",
					}}
				>
					{text}
				</Typography>
			</Box>
		</>
	);
};

export default BreakdownPieChart;
