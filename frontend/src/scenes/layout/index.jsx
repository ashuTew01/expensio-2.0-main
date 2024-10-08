import React, { useState } from "react";
import { Box, useMediaQuery } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom"; //this allows us to have the template layouts.
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import ChatBot from "../chatbot";

const Layout = () => {
	const isNonMobile = useMediaQuery("(min-width: 600px)");
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);
	const location = useLocation();

	const isFullChatPage = location.pathname === "/smart-ai-chat";
	// const userId = useSelector((state) => state.global.userId);

	return (
		<Box display={isNonMobile ? "flex" : "block"} width="100%" height="100%">
			<Sidebar
				isNonMobile={isNonMobile}
				drawerWidth="250px"
				isSidebarOpen={isSidebarOpen}
				setIsSidebarOpen={setIsSidebarOpen}
			/>
			<Box flexGrow={1}>
				{" "}
				{/* flexGrow = 1 lets it take as much space as it could.*/}
				<Navbar
					isSidebarOpen={isSidebarOpen}
					setIsSidebarOpen={setIsSidebarOpen}
				/>
				<Outlet />
				{!isFullChatPage && <ChatBot />}
			</Box>
		</Box>
	);
};

export default Layout;
