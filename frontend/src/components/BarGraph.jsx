import React from "react";
import { ResponsiveBar } from "@nivo/bar";
import { Box, useTheme } from "@mui/material";

const BarGraph = ({ isDashboard = false, formattedData, beSmall = true }) => {
	const theme = useTheme();

	return (
		<Box
			height={beSmall ? "40px" : "350px"}
			minHeight={isDashboard ? "300px" : undefined}
			minWidth={isDashboard ? "325px" : undefined}
			position="relative"
		>
			<ResponsiveBar
				// Data to be displayed in the bar graph
				data={formattedData}
				// Keys represent the field(s) in the data object to be displayed as bars (amountSpent in this case)
				keys={["amountSpent"]}
				// The key to use for indexing the data (category in this case)
				indexBy="category"
				height="400"
				// Margins around the chart area for labels, axes, etc.
				margin={{ top: 50, right: 130, bottom: 70, left: 60 }}
				// Padding between bars, makes the bars look spaced
				padding={0.4}
				// Colors are now correctly applied from formattedData
				colors={({ data }) => data.color}
				// Rounded corners for a smoother appearance
				borderRadius={6}
				// Add axis bottom and left (X and Y axes) explicitly
				axisBottom={{
					tickSize: 5,
					tickPadding: 5,
					tickRotation: 0,
					legend: "Category", // Label for the X-axis
					legendPosition: "middle",
					legendOffset: 40,
					tickColor: "#FFFFFF",
					tickTextColor: "#FFFFFF", // Ensure white color for labels
					legendTextColor: "#FFFFFF", // White color for legend
				}}
				axisLeft={{
					tickSize: 5,
					tickPadding: 5,
					tickRotation: 0,
					legend: "Amount Spent", // Label for the Y-axis
					legendPosition: "middle",
					legendOffset: -50,
					tickColor: "#FFFFFF",
					tickTextColor: "#FFFFFF", // Ensure white color for labels
					legendTextColor: "#FFFFFF", // White color for legend
				}}
				// Disable grid lines to make the chart cleaner
				enableGridY={false}
				enableGridX={false}
				// Skip labels for small bars
				labelSkipWidth={12}
				labelSkipHeight={12}
				// Labels on bars (inside the bars)
				labelTextColor="white"
				// Customize tooltip to show details in a nice box
				tooltip={({ id, value, color, data }) => (
					<div
						style={{
							padding: "10px",
							background: "#222",
							color: "#fff",
							borderRadius: "4px",
							boxShadow: "0 3px 6px rgba(0,0,0,0.1)",
						}}
					>
						<strong>{data.category}</strong>: ${value}
					</div>
				)}
				// Add animation for a smoother appearance
				animate={true}
				motionStiffness={90}
				motionDamping={15}
				// Custom theme to enhance axis labels and styling
				theme={{
					axis: {
						ticks: {
							text: {
								fill: "#FFFFFF", // White color for axis ticks
								fontSize: "14px", // Larger font for better readability
							},
						},
						legend: {
							text: {
								fill: "#FFFFFF", // White color for legend text
								fontSize: "16px", // Make legend more readable
							},
						},
					},
				}}
			/>
		</Box>
	);
};

export default BarGraph;
