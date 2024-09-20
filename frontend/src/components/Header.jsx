import { Typography, Box, useTheme } from "@mui/material";
import React from "react";

const Header = ({
	title,
	subtitle,
	variant = "h1",
	style = {},
	titleFontColor = "",
	subtitleFontColor = "",
}) => {
	const theme = useTheme();
	if (titleFontColor === "") {
		titleFontColor = theme.palette.secondary[300];
	}
	if (subtitleFontColor === "") {
		subtitleFontColor = theme.palette.secondary[300];
	}
	return (
		<Box sx={style}>
			<Typography
				variant={variant}
				color={titleFontColor}
				fontWeight="bold"
				sx={{ mb: "5px" }}
			>
				{title}
			</Typography>
			<Typography variant="h5" color={subtitleFontColor}>
				{subtitle}
			</Typography>
		</Box>
	);
};

export default Header;
