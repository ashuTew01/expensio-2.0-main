import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	userInfo: localStorage.getItem("userInfoExpensio")
		? JSON.parse(localStorage.getItem("userInfoExpensio"))
		: null,
	token: localStorage.getItem("tokenExpensio")
		? JSON.parse(localStorage.getItem("tokenExpensio"))
		: null,
	userExists: null,
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		setUserInfo: (state, action) => {
			// console.log(action.payload);
			state.userInfo = action.payload;
			localStorage.setItem("userInfoExpensio", JSON.stringify(action.payload));
		},
		setToken: (state, action) => {
			state.token = action.payload;
			localStorage.setItem("tokenExpensio", JSON.stringify(action.payload));
		},
		setIfUserExist: (state, action) => {
			// console.log(action.payload);
			state.userExists = action.payload;
		},
		removeCredentials: (state, action) => {
			state.userInfo = null;
			localStorage.removeItem("tokenExpensio");
			localStorage.removeItem("userInfoExpensio");
		},
	},
});

export const { setUserInfo, setToken, removeCredentials, setIfUserExist } =
	authSlice.actions;

export default authSlice.reducer;
