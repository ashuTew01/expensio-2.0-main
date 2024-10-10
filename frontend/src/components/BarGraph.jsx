// src/components/BarGraph.jsx
import React from "react";
import { ResponsiveBar } from "@nivo/bar";
import { Box, useTheme } from "@mui/material";

const BarGraph = ({
	isDashboard = false,
	formattedData,
	xAxis,
	yAxis,
	currency,
}) => {
	const theme = useTheme();

	// Define a vibrant color palette
	const colorPalette = [
		"#FF6B6B", // Red
		"#F06595", // Pink
		"#CC5DE8", // Purple
		"#845EF7", // Deep Purple
		"#5C7CFA", // Indigo
		"#4DABF7", // Blue
		"#22B8CF", // Cyan
		"#20C997", // Teal
		"#51CF66", // Green
		"#94D82D", // Lime
		"#FFD43B", // Yellow
		"#FFA94D", // Orange
		"#FF6B6B", // Red
		"#F06595", // Pink
		"#CC5DE8", // Purple
		"#845EF7", // Deep Purple
		"#5C7CFA", // Indigo
		"#4DABF7", // Blue
		"#22B8CF", // Cyan
		"#20C997", // Teal
	];

	// Map categories to colors
	const categoryColors = {};
	formattedData.forEach((item, index) => {
		categoryColors[item.category] = colorPalette[index % colorPalette.length];
	});

	// Truncate labels if they are too long
	const maxLabelLength = 8;
	const dataWithTruncatedLabels = formattedData.map((item) => {
		let label = item.category;
		if (label.length > maxLabelLength) {
			label = label.substring(0, maxLabelLength) + "...";
		}
		return { ...item, categoryTruncated: label };
	});

	// Custom tooltip to display full category name
	const CustomTooltip = ({ id, value, color, data }) => (
		<div
			style={{
				padding: "12px 16px",
				background: "#1A1A1A",
				color: "#FFFFFF",
				border: `1px solid ${color}`,
				borderRadius: "4px",
			}}
		>
			<strong style={{ color }}>{data.category}</strong>
			<br />
			{yAxis + ": " || ""}{" "}
			<strong>
				{currency || ""}
				{value}
			</strong>
		</div>
	);

	return (
		<Box
			height="100%"
			width="100%"
			position="relative"
			sx={{
				backgroundColor: "none",
				padding: "1rem",
			}}
		>
			<ResponsiveBar
				data={dataWithTruncatedLabels}
				keys={["amountSpent"]}
				indexBy="categoryTruncated"
				margin={{ top: 50, right: 30, bottom: 120, left: 70 }}
				padding={0.2}
				colors={({ data }) => categoryColors[data.category]}
				borderRadius={1}
				borderWidth={2}
				// borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
				theme={{
					background: "transparent",
					axis: {
						domain: {
							line: {
								stroke: theme.palette.grey[700],
								strokeWidth: 1,
							},
						},
						ticks: {
							line: {
								stroke: theme.palette.grey[700],
								strokeWidth: 1,
							},
							text: {
								fill: "#FFFFFF",
								fontSize: 14,
							},
						},
						legend: {
							text: {
								fill: "#FFFFFF",
								fontSize: 14,
								fontWeight: "bold",
							},
						},
					},
					grid: {
						line: {
							stroke: theme.palette.grey[800],
							strokeWidth: 1,
						},
					},
					tooltip: {
						container: {
							background: "#1A1A1A",
							color: "#FFFFFF",
							fontSize: 14,
						},
					},
					labels: {
						text: {
							fill: "#FFFFFF",
							fontSize: 12,
							fontWeight: "bold",
						},
					},
				}}
				axisTop={null}
				axisRight={null}
				axisBottom={{
					tickSize: 0,
					tickPadding: 5,
					tickRotation: -90,
					legend: xAxis || undefined,
					legendPosition: xAxis ? "middle" : undefined,
					legendOffset: xAxis ? 90 : undefined,
				}}
				axisLeft={{
					tickSize: 0,
					tickPadding: 10,
					tickRotation: 0,
					legend: yAxis || undefined,
					legendPosition: yAxis ? "middle" : undefined,
					legendOffset: yAxis ? -60 : undefined,
				}}
				enableLabel={false}
				enableGridY={true}
				enableGridX={false}
				tooltip={CustomTooltip}
				animate={true}
				motionConfig="gentle"
			/>
		</Box>
	);
};

export default BarGraph;
