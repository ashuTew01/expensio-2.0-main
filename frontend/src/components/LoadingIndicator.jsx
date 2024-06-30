import React from "react";
import { css } from "@emotion/react";
import ClipLoader from "react-spinners/ClipLoader";
import { useTheme } from "@mui/material";

const override = css`
	display: block;
	margin: 0 auto;
`;

const LoadingIndicator = () => {
	const theme = useTheme();
	return (
		<div
			style={{
				minHeight: "200px",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<ClipLoader
				color={theme.palette.primary.main}
				loading={true}
				css={override}
				size={50}
			/>
		</div>
	);
};

export default LoadingIndicator;
