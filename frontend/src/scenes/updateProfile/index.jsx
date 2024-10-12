import React from "react";
import FlexBetween from "../../components/FlexBetween.jsx";
import Header from "../../components/Header.jsx";
import { Box, Button, useTheme, useMediaQuery } from "@mui/material";
import UpdateProfileForm from "../../components/UpdateProfileForm.jsx";
import { useNavigate } from "react-router-dom";

const UpdateProfilePage = () => {
	const theme = useTheme();
	const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
	const navigate = useNavigate();

	return (
		<Box m="1.5rem 2.5rem">
			<FlexBetween>
				<Header
					title="MANAGE YOUR PROFILE"
					subtitle="Edit your details for a personalized experience."
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
					gridColumn="span 8"
					gridRow="span 3"
					backgroundColor={theme.palette.background.alt}
					p="1.5rem"
					borderRadius="0.55rem"
				>
					<UpdateProfileForm />
				</Box>
			</Box>
		</Box>
	);
};

export default UpdateProfilePage;
