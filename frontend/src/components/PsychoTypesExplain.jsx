import React from "react";
import {
	Box,
	Typography,
	Paper,
	Grid,
	Divider,
	CircularProgress,
	useTheme,
} from "@mui/material";

const PsychologicalTypesExplain = ({
	psychoTypesData,
	psychoTypesLoading,
	psychoTypesError,
}) => {
	const theme = useTheme();

	if (psychoTypesLoading) {
		return (
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				height="100%"
			>
				<CircularProgress />
			</Box>
		);
	}

	return (
		<Box p="1.5rem" height="100%" overflow="auto">
			<Typography
				variant="h4"
				mb={3}
				textAlign="center"
				sx={{ fontWeight: "bold" }}
			>
				COGNITIVE TRIGGERS
			</Typography>
			<Grid container spacing={3}>
				{psychoTypesData?.cognitiveTriggers?.map((type) => (
					<Grid item xs={12} key={type._id}>
						<Paper
							elevation={3}
							sx={{ p: 2, backgroundColor: theme.palette.background.default }}
						>
							<Typography variant="h4" color={theme.palette.grey[10]}>
								{type.name}
							</Typography>
							<Box height="10px"></Box>
							<Typography variant="body1" color={theme.palette.grey[300]}>
								{type.description}
							</Typography>
						</Paper>
					</Grid>
				))}
			</Grid>
		</Box>
	);
};

export default PsychologicalTypesExplain;
