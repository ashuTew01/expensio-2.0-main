import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";

import "./index.css";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { themeSettings } from "./theme";

import HomeScreen from "./scenes/homescreen";
import Dashboard from "./scenes/dashboard";
import PrivateRoute from "./components/PrivateRoute";
import Layout from "./scenes/layout";
import OtpPage from "./scenes/otpPage";
import UserDataForm from "./scenes/userDataFormPage";
import AddExpenseScreen from "./scenes/expense/add";
import ExpenseListScreen from "./scenes/expense/list";
import ExpenseScreen from "./scenes/expense/screen";
import IncomeListScreen from "./scenes/income/list";
import AddIncomeScreen from "./scenes/income/add";
import SummaryScreen from "./scenes/summary";
import ExpenseFinancialData from "./scenes/expense-financial-data";
import IncomeFinancialData from "./scenes/income-financial-data";
import FullChatPage from "./scenes/full-page-chat";

import { SocketProvider } from "./context/SocketContext";
import EmailLoginPage from "./scenes/email-login-page";
import IncomeScreen from "./scenes/income/screen";
import PageNotFound from "./scenes/notFound";
import UpdateProfilePage from "./scenes/updateProfile";

function App() {
	const mode = useSelector((state) => state.global.mode);
	const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
	return (
		<SocketProvider>
			<BrowserRouter>
				<ThemeProvider theme={theme}>
					<CssBaseline />
					<ToastContainer />

					<Routes>
						<Route path="" element={<PrivateRoute />}>
							<Route element={<Layout />}>
								{" "}
								{/* will exist on every page. Eg, navbar and sidebar. */}
								<Route path="/dashboard" element={<Dashboard />} />
								<Route path="/expense/add" element={<AddExpenseScreen />} />
								<Route path="/expense/:id" element={<ExpenseScreen />} />
								<Route path="/expense/list" element={<ExpenseListScreen />} />
								{/* income */}
								<Route path="/income/list" element={<IncomeListScreen />} />
								<Route path="/income/add" element={<AddIncomeScreen />} />
								<Route path="/income/:id" element={<IncomeScreen />} />
								{/* Summary routes */}
								<Route path="/user/summary" element={<SummaryScreen />} />
								<Route
									path="/user/expense-financial-data"
									element={<ExpenseFinancialData />}
								/>
								<Route
									path="/user/income-financial-data"
									element={<IncomeFinancialData />}
								/>
								<Route
									path="/user/update-profile"
									element={<UpdateProfilePage />}
								/>
								{/* chat page */}
								<Route path="/smart-ai-chat" element={<FullChatPage />} />
							</Route>
						</Route>

						<Route>
							<Route index path="/" element={<HomeScreen />} />

							<Route path="/login" element={<EmailLoginPage />} />
							<Route path="/otp" element={<OtpPage />} />
							<Route path="/user-data-form" element={<UserDataForm />} />
							<Route path="/*" element={<PageNotFound />} />
						</Route>
					</Routes>
				</ThemeProvider>
			</BrowserRouter>
		</SocketProvider>
	);
}

export default App;
