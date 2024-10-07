import React from "react";
import { ResponsiveBar } from "@nivo/bar";
import { Box, useTheme, Typography } from "@mui/material";

const BarGraph = ({ isDashboard = false, formattedData, beSmall = true }) => {
	const theme = useTheme();

	console.log("format", formattedData);

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
				// Height of the graph set to 400px
				height="400"
				// Margins around the chart area for labels, axes, etc.
				margin={{ top: 50, right: 130, bottom: 70, left: 60 }}
				// Padding between bars, makes the bars look spaced
				padding={0.4}
				// Assigning custom colors from the data, typically passed with the formattedData
				colors={({ data }) => data.color}
				// Border color of each bar, slightly darker than the bar color
				borderColor={{
					from: "color", // Takes the color from each bar's color
					modifiers: [["darker", 1.6]], // Darkens the border by 60%
				}}
				// Axis top is disabled as it's not needed
				axisTop={null}
				// Axis right is disabled as well
				axisRight={null}
				// Axis bottom settings (for category labels and legends)
				axisBottom={{
					tickSize: 5, // Size of the tick marks
					tickPadding: 5, // Padding between ticks and axis
					tickRotation: 0, // No rotation of the tick labels
					legend: "Category",
					legendPosition: "middle", // Legend is positioned in the middle
					legendOffset: 50, // Distance of the legend from the axis
				}}
				// Axis left settings (for the 'Amount Spent' axis)
				axisLeft={{
					tickSize: 5, // Size of the tick marks
					tickPadding: 5, // Padding between ticks and axis
					tickRotation: 0, // No rotation of the tick labels
					legend: "Amount Spent", // Label for the left axis
					legendPosition: "middle", // Legend is positioned in the middle
					legendOffset: -50, // Distance of the legend from the axis
				}}
				// Label settings for the bar values
				labelSkipWidth={12} // Skip labels for bars with a width less than 12px
				labelSkipHeight={12} // Skip labels for bars with a height less than 12px
				labelTextColor="grey"
				// Animation settings for smooth transitions
				animate={true}
				motionStiffness={90} // Controls the stiffness of the transition animations
				motionDamping={15} // Controls the damping (smoothness) of the animations
				// Custom theme settings for the axis ticks and text color

				theme={{
					axis: {
						ticks: {
							text: {
								fill: theme.palette.secondary[200], // Axis tick text color based on theme's primary text color
							},
						},
					},
				}}
			/>
		</Box>
	);
};

export default BarGraph;
