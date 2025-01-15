import { createSlice } from "@reduxjs/toolkit";

import initialState from "~/modules/_core/state/rolesSlice/initState";

export const rolesSlice = createSlice({
  name: "roles",
  initialState,
  reducers: {
    reset: () => initialState,
    setCurrentRole: (state, action) => {
      // eslint-disable-next-line no-param-reassign
      state.currentRole = action.payload;
    },
  },
});

export const { setCurrentRole, reset: resetRole } = rolesSlice.actions;
export default rolesSlice.reducer;
