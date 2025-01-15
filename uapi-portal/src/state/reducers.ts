import { Reducer } from "@reduxjs/toolkit";
import { combineReducers } from "redux";

import { resetAll } from "~/state/actions";

import coreReducer, { resetCore } from "~/modules/_core/state/coreSlice";

import rolesSlice, { resetRole } from "~/core/state/rolesSlice";
import userSlice, { resetUser } from "~/core/state/userSlice";

const appReducer = combineReducers({
  core: coreReducer,
  roles: rolesSlice,
  user: userSlice,
});

type AppState = ReturnType<typeof appReducer>;

const rootReducer: Reducer<AppState> = (state, action) => {
  if (action.type === resetAll.type) {
    // Reset the state of each slice
    // eslint-disable-next-line no-param-reassign
    state = {
      core: coreReducer(undefined, resetCore()),
      roles: rolesSlice(undefined, resetRole()),
      user: userSlice(undefined, resetUser()),
    } as AppState;
  }
  return appReducer(state, action);
};

export default rootReducer;
