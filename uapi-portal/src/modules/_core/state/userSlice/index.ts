import { createSlice } from "@reduxjs/toolkit";

import initialState from "~/modules/_core/state/userSlice/initState";

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    reset: () => initialState,
    setCurrentUser: (state, action) => {
      // eslint-disable-next-line no-param-reassign
      state.currentUser = action.payload;
    },
    setUserNameValidity: (state, action) => {
      // eslint-disable-next-line no-param-reassign
      state.userNameValidation = action.payload;
    },
    setUserEmailValidity: (state, action) => {
      // eslint-disable-next-line no-param-reassign
      state.userEmailValidation = action.payload;
    },
  },
});

export const {
  setCurrentUser,
  setUserEmailValidity,
  setUserNameValidity,
  reset: resetUser,
} = userSlice.actions;
export default userSlice.reducer;
