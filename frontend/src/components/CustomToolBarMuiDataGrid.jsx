import { Box } from "@mui/material";
import {
	GridToolbarColumnsButton,
	GridToolbarContainer,
	GridToolbarDensitySelector,
	GridToolbarExport,
	GridToolbarFilterButton,
} from "@mui/x-data-grid";

export function CustomToolbar() {
	return (
		<GridToolbarContainer>
			<GridToolbarColumnsButton />
			<GridToolbarFilterButton />
			<GridToolbarDensitySelector
				slotProps={{ tooltip: { title: "Change density" } }}
			/>
			<Box sx={{ flexGrow: 1 }} />
			<GridToolbarExport
				slotProps={{
					tooltip: { title: "Export data" },
					button: {
						variant: "outlined",
						sx: {
							color: "white", // Change text color
							borderColor: "primary.main", // Change border color
							"&:hover": {
								borderColor: "primary.dark", // Change border color on hover
								backgroundColor: "primary.light", // Change background color on hover
							},
						},
					},
				}}
			/>
		</GridToolbarContainer>
	);
}
