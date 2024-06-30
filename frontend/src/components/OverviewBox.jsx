import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import FlexBetween from "./FlexBetween";

const options = {
  year: "numeric",
  month: "short",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
};

const OverviewBox = ({ expense, colSpan, rowSpan }) => {
  const theme = useTheme();
  console.log(expense);
  //   const { title, amount, dateTime, mood, category, psychologicalType } =
  // expense;

  //   const t = expense[title];
  //   console.log(t);
  //   console.log(title);

  return (
    <Box
      gridColumn={`span ${colSpan ? colSpan : 2}`}
      gridRow={`span ${rowSpan ? rowSpan : 1}`}
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
      p="1.25rem 1rem"
      flex="1 1 100%"
      backgroundColor={theme.palette.background.alt}
      borderRadius="0.55rem"
    >
      <Box
        display="flex"
        // justifyContent="space-between"
        alignItems="space-between"
      >
        <Typography
          // variant="h1"
          fontSize={100}
          fontWeight="600"
          sx={{ color: theme.palette.secondary[200] }}
        >
          {expense?.amount}
        </Typography>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="flex-end"
          paddingBottom={4}
          marginLeft={2}
        >
          <Typography variant="h2" sx={{ fontWeight: "bold" }}>
            Rs.
          </Typography>
        </Box>
      </Box>
      <FlexBetween gap="2rem">
        <Typography
          variant="h5"
          // fontStyle="italic"
          sx={{ color: theme.palette.secondary.light }}
        >
          Title
        </Typography>
        <Typography sx={{ color: theme.palette.grey[400] }}>
          {expense?.title}
        </Typography>
      </FlexBetween>

      <Box height={7}></Box>
      <FlexBetween gap="2rem">
        <Typography
          variant="h5"
          // fontStyle="italic"
          sx={{ color: theme.palette.secondary.light }}
        >
          Mood
        </Typography>
        <Typography sx={{ color: theme.palette.grey[400] }}>
          {expense?.mood}
        </Typography>
      </FlexBetween>

      <Box height={7}></Box>
      <FlexBetween gap="2rem">
        <Typography
          variant="h5"
          // fontStyle="italic"
          sx={{ color: theme.palette.secondary.light }}
        >
          Date Time
        </Typography>
        <Typography sx={{ color: theme.palette.grey[400] }}>
          {new Date(expense?.dateTime).toLocaleDateString("en-US", options)}
        </Typography>
      </FlexBetween>

      <Box height={7}></Box>
      <FlexBetween gap="2rem">
        <Typography
          variant="h5"
          // fontStyle="italic"
          sx={{ color: theme.palette.secondary.light }}
        >
          Category
        </Typography>
        <Typography sx={{ color: theme.palette.grey[400] }}>
          {expense?.category.name}
        </Typography>
      </FlexBetween>

      <Box height={7}></Box>
      <FlexBetween gap="2rem">
        <Typography
          variant="h5"
          // fontStyle="italic"
          sx={{ color: theme.palette.secondary.light }}
        >
          Psychological Type
        </Typography>
        <Typography sx={{ color: theme.palette.grey[400] }}>
          {expense?.psychologicalType.name}
        </Typography>

        {/* <Box height={7}></Box>
        {expense?.description ? (
          <>
            <FlexBetween gap="2rem">
              <Typography
                variant="h5"
                // fontStyle="italic"
                sx={{ color: theme.palette.secondary.light }}
              >
                Description
              </Typography>
              <Typography sx={{ color: theme.palette.grey[400] }}>
                {expense?.category.name}
              </Typography>
            </FlexBetween>
          </>
        ) : null} */}
      </FlexBetween>
    </Box>
  );
};

export default OverviewBox;
