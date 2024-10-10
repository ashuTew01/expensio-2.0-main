// src/scenes/layout/index.jsx
import React, { useState } from "react";
import { Box, useMediaQuery, Toolbar } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom"; //this allows us to have the template layouts.
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import ChatBot from "../chatbot";

const Layout = () => {
	const isNonMobile = useMediaQuery("(min-width: 600px)");
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);
	const location = useLocation();

	const isFullChatPage = location.pathname === "/smart-ai-chat";

	return (
		<Box display={isNonMobile ? "flex" : "block"} width="100%" height="100%">
			<Sidebar
				isNonMobile={isNonMobile}
				drawerWidth="250px"
				isSidebarOpen={isSidebarOpen}
				setIsSidebarOpen={setIsSidebarOpen}
			/>
			<Box flexGrow={1}>
				{!isFullChatPage && (
					<Navbar
						isSidebarOpen={isSidebarOpen}
						setIsSidebarOpen={setIsSidebarOpen}
						isFixed={isFullChatPage} // Pass the isFixed prop
					/>
				)}
				{/* {isFullChatPage && <Toolbar />} Spacer when Navbar is fixed */}
				<Outlet />
				{!isFullChatPage && <ChatBot />}
			</Box>
		</Box>
	);
};

export default Layout;
