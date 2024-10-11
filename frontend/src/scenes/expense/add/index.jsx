import React from "react";
import FlexBetween from "../../../components/FlexBetween.jsx";
import Header from "../../../components/Header.jsx";
import { Box, Button, useTheme, useMediaQuery } from "@mui/material";
import ExpensesForm from "../../../components/ExpensesForm.jsx";
import { useGetAllCognitiveTriggersQuery } from "../../../state/api.js";
import PsychologicalTypesExplain from "../../../components/PsychoTypesExplain.jsx";

const AddExpenseScreen = () => {
	const theme = useTheme();
	const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");

	const {
		data: cognitiveTriggersData,
		isLoading: cognitiveTriggersDataLoading,
		isError: cognitiveTriggersDataError,
	} = useGetAllCognitiveTriggersQuery();

	// console.log(psychoTypesData)

	return (
		<Box m="1.5rem 2.5rem">
			<FlexBetween>
				<Header
					title="TRACK YOUR SPENDING"
					subtitle="Log your expenses to gain better control over your spending."
				/>

				<Box>
					<Button
						sx={{
							backgroundColor: theme.palette.secondary.light,
							color: theme.palette.background.alt,
							fontSize: "14px",
							fontWeight: "bold",
							padding: "10px 20px",
						}}
					>
						EXPENSIO
					</Button>
				</Box>
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
					gridColumn="span 8"
					gridRow="span 3"
					backgroundColor={theme.palette.background.alt}
					p="1.5rem"
					borderRadius="0.55rem"
				>
					<ExpensesForm
						cognitiveTriggersData={cognitiveTriggersData}
						cognitiveTriggersDataLoading={cognitiveTriggersDataLoading}
						cognitiveTriggersDataError={cognitiveTriggersDataError}
					/>
				</Box>
				<Box
					gridColumn="span 4"
					gridRow="span 3"
					backgroundColor={theme.palette.background.alt}
					p="1.5rem"
					borderRadius="0.55rem"
				>
					<PsychologicalTypesExplain
						psychoTypesData={cognitiveTriggersData}
						psychoTypesLoading={cognitiveTriggersDataLoading}
						psychoTypesError={cognitiveTriggersDataError}
					/>
				</Box>
			</Box>
		</Box>
	);
};

export default AddExpenseScreen;
