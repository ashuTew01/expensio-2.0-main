import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: localStorage.getItem("userInfoExpensio")
    ? JSON.parse(localStorage.getItem("userInfoExpensio"))
    : null,
  token: localStorage.getItem("tokenExpensio") ? JSON.parse(localStorage.getItem("tokenExpensio")) : null,
  userExists: null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
    },
    setToken: (state, action) => {
      state.token = action.payload;
      localStorage.setItem("tokenExpensio", JSON.stringify(action.payload));
    },
    setIfUserExist: (state, action) => {
      console.log(action.payload)
      state.userExists = action.payload;
    },
    removeCredentials: (state, action) => {
      state.userInfo = null;
      localStorage.removeItem("tokenExpensio");
    },
  },
});

export const { setUserInfo, setToken, removeCredentials, setIfUserExist } = authSlice.actions;

export default authSlice.reducer;
