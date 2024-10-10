import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import BarGraph from "../BarGraph";

const DisplayBarGraph = ({ title, formattedData, yAxis, xAxis, currency }) => {
	const theme = useTheme();
	return (
		<>
			<Box
				gridColumn="span 8"
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

				<BarGraph
					yAxis={yAxis || undefined}
					isDashboard={true}
					formattedData={formattedData}
					currency={currency || undefined}
					xAxis={xAxis || undefined}
				/>
			</Box>
		</>
	);
};

export default DisplayBarGraph;
