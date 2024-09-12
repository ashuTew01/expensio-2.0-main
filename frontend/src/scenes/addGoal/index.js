import React from "react";
import FlexBetween from "components/FlexBetween";
import Header from "components/Header";
import {
	Box,
	Button,
	Typography,
	useTheme,
	useMediaQuery,
} from "@mui/material";
import GoalsForm from "components/goals/GoalForm";

const AddGoalScreen = () => {
	const theme = useTheme();
	const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");

	return (
		<Box m="1.5rem 2.5rem">
			<FlexBetween>
				<Header title="ADD A GOAL" subtitle="Add a Goal and stay motivated!" />

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
					gridColumn="span 12"
					gridRow="span 3"
					backgroundColor={theme.palette.background.alt}
					p="1.5rem"
					borderRadius="0.55rem"
				>
					<GoalsForm />
				</Box>
			</Box>
		</Box>
	);
};

export default AddGoalScreen;
