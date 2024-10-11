import React from "react";
import { Box, Typography } from "@mui/material";
import { useSelector } from "react-redux";

const Hero = ({ totalMoneyEarned, totalMoneySpent }) => {
	const fname = useSelector((state) => state.auth.userInfo?.first_name);

	const expenditurePercentage =
		(Number(totalMoneySpent) /
			(Number(totalMoneyEarned) !== 0 ? Number(totalMoneyEarned) : 1)) *
		100;

	let recommendation = "";
	let color = "#ffffff";

	if (expenditurePercentage < 50) {
		recommendation = "You're saving well! Consider investing for growth.";
		color = "#2ecc71";
	} else if (expenditurePercentage >= 50 && expenditurePercentage < 70) {
		recommendation =
			"Good balance, but watch discretionary spending to save more.";
		color = "#3498db";
	} else if (expenditurePercentage >= 70 && expenditurePercentage < 90) {
		recommendation =
			"You're approaching a high spending zone. Cut back to increase savings.";
		color = "#f1c40f";
	} else if (expenditurePercentage >= 90 && expenditurePercentage <= 100) {
		recommendation =
			"You're spending all you earn. Look into budgeting to save.";
		color = "#e67e22";
	} else if (expenditurePercentage > 100 && expenditurePercentage <= 120) {
		recommendation =
			"You're spending more than you earn. Consider immediate cutbacks.";
		color = "#e74c3c";
	} else if (expenditurePercentage > 120 && expenditurePercentage <= 150) {
		recommendation =
			"There is severe overspending! Reduce expenses or increase income ASAP.";
		color = "#c0392b";
	} else {
		recommendation =
			"Critical! Reevaluate your financial strategy to avoid debt spiral.";
		color = "#8e44ad";
	}

	return (
		<>
			<Box
				gridColumn="span 4"
				gridRow="span 2"
				backgroundColor="transparent"
				p="1rem"
				borderRadius="0.55rem"
				display="flex"
				justifyContent="space-between"
			>
				<Box
					component="img"
					sx={{
						height: 330,
						width: 330,
						// maxHeight: { xs: 233, md: 167 },
						// maxWidth: { xs: 350, md: 250 },
					}}
					alt={"Love Earth"}
					src={"/dashboard.png"}
				/>
			</Box>
			<Box
				gridColumn="span 8"
				gridRow="span 2"
				backgroundColor="transparent"
				p="1rem"
				borderRadius="0.55rem"
				display="flex"
				flexDirection="column"
				mt="5rem"
			>
				<Box>
					<Typography variant="h1" sx={{ fontWeight: "bold" }}>
						Hey {fname}!
					</Typography>
					<Typography variant="h1" sx={{}}>
						You spent{" "}
						<Box
							component="span"
							sx={{
								fontWeight: "bold",
								color: "#ff5454", // Highlight the number of expenses with a bright yellow color
								textShadow: "2px 2px 5px rgba(0, 0, 0, 0.4)", // Add depth to the number
								variant: "h1",
							}}
						>
							₹{totalMoneySpent || 0}
						</Box>{" "}
					</Typography>
					<Typography variant="h1" sx={{}}>
						and earned{" "}
						<Box
							component="span"
							sx={{
								fontWeight: "bold",
								color: "#75e05a", // Highlight the number of expenses with a bright yellow color
								textShadow: "2px 2px 5px rgba(0, 0, 0, 0.4)", // Add depth to the number
								variant: "h1",
							}}
						>
							₹{totalMoneyEarned || 0}
						</Box>{" "}
						this month.
					</Typography>
					<Typography variant="h1" sx={{ fontWeight: "bold" }}></Typography>
					<Box height="10px"></Box>
				</Box>
				<Box width="38rem">
					<Typography color={color} variant="h4" sx={{ fontSize: "0.2 rem" }}>
						Your expenditure is{" "}
						<Box
							component="span"
							sx={{
								fontWeight: "bold",
								textShadow: "2px 2px 5px rgba(0, 0, 0, 0.4)", // Add depth to the number
								variant: "h1",
							}}
						>
							{expenditurePercentage.toFixed(0)}%
						</Box>{" "}
						of your income. {" " + recommendation}
					</Typography>
					{/* <Typography variant="h4" sx={{ fontSize: "0.2 rem" }}>
						{recommendation}
					</Typography> */}
				</Box>
			</Box>
		</>
	);
};

export default Hero;
