import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: localStorage.getItem("userInfoExpensio")
    ? JSON.parse(localStorage.getItem("userInfoExpensio"))
    : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem("userInfoExpensio", JSON.stringify(action.payload));
    },
    removeCredentials: (state, action) => {
      state.userInfo = null;
      localStorage.removeItem("userInfoExpensio");
      // localStorage.removeItem("tokenExpensio");
    },
  },
});

export const { setCredentials, removeCredentials } = authSlice.actions;

export default authSlice.reducer;
