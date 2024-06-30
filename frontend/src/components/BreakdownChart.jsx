import React from "react";
import { ResponsivePie } from "@nivo/pie";
import { Box, useTheme } from "@mui/material";

const BreakdownChart = ({
  isDashboard = false,
  categories,
  beSmall = true,
}) => {
  const theme = useTheme();

  const formattedData = Object.entries(categories).map(
    ([category, value], i) => ({
      id: category,
      label: category,
      value: parseInt(value), // Parse the value as an integer
      color: theme.palette.secondary[i % theme.palette.secondary.length],
    })
  );

  //   console.log(formattedData);

  return (
    <Box
      height={beSmall ? "100px" : "400px"}
      width={undefined}
      minHeight={isDashboard ? "325px" : undefined}
      minWidth={isDashboard ? "325px" : undefined}
      position="relative"
    >
      <ResponsivePie
        data={formattedData}
        theme={{
          axis: {
            domain: {
              line: {
                stroke: theme.palette.secondary[200],
              },
            },
            legend: {
              text: {
                fill: theme.palette.secondary[200],
              },
            },
            ticks: {
              line: {
                stroke: theme.palette.secondary[200],
                strokeWidth: 1,
              },
              text: {
                fill: theme.palette.secondary[200],
              },
            },
          },
          legends: {
            text: {
              fill: theme.palette.secondary[200],
            },
          },
          tooltip: {
            container: {
              color: theme.palette.primary.main,
            },
          },
        }}
        margin={
          isDashboard
            ? { top: 40, right: 80, bottom: 100, left: 50 }
            : { top: 40, right: 80, bottom: 80, left: 80 }
        }
        sortByValue={true}
        innerRadius={0.4}
        activeOuterRadiusOffset={6}
        enableArcLinkLabels={!isDashboard}
        borderWidth={1}
        borderColor={{
          from: "color",
          modifiers: [["darker", 0.2]],
        }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{
          from: "color",
          modifiers: [["darker", 2]],
        }}
        legends={[
          {
            anchor: "top-left",
            direction: "column",
            justify: false,
            translateX: 0,
            translateY: 0,
            itemWidth: 85,
            itemHeight: 18,
            itemsSpacing: 4,
            symbolSize: 18,
            symbolShape: "circle",
            itemDirection: "left-to-right",
            effects: [
              {
                on: "hover",
                style: {
                  itemTextColor: theme.palette.primary[500],
                },
              },
            ],
          },
        ]}
      />
    </Box>
  );
};

export default BreakdownChart;
