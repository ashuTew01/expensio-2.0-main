import React from "react";
import FlexBetween from "../../../components/FlexBetween.jsx";
import Header from "../../../components/Header.jsx";
import { Box, useTheme, useMediaQuery } from "@mui/material";
import IncomeForm from "../../../components/IncomeForm.jsx";

const AddIncomeScreen = () => {
	const theme = useTheme();
	const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");

	return (
		<Box m="1.5rem 2.5rem">
			<FlexBetween>
				<Header
					title="CAPTURE YOUR EARNINGS"
					subtitle="Document every income source to stay organized and informed."
				/>
			</FlexBetween>
			<Box
				mt="20px"
				display="grid"
				gridTemplateColumns="repeat(12, 1fr)"
				gridAutoRows="160px"
				gap="30px"
				sx={{
					"& > div": { gridColumn: isNonMediumScreens ? undefined : "span 12" },
				}}
			>
				<Box
					gridColumn="span 12"
					gridRow="span 3"
					backgroundColor={theme.palette.background.alt}
					p="1.5rem"
					borderRadius="0.55rem"
				>
					<IncomeForm />
				</Box>
			</Box>
		</Box>
	);
};

export default AddIncomeScreen;
