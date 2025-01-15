/* eslint-disable no-param-reassign */
import { createSlice } from "@reduxjs/toolkit";

import initialState from "~/modules/_core/state/coreSlice/initState";

export const coreSlice = createSlice({
  name: "core",
  initialState,
  reducers: {
    reset: () => initialState,
    setAuthUser: (state, action) => {
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.validity = action.payload.validity;
      state.refreshValidity = action.payload.refreshValidity;
      state.tokenType = action.payload.tokenType;
    },
    setUserInfo: (state, action) => {
      state.userInfo = action.payload.userInfo;
    },
    setResponseMessage: (state, action) => {
      state.message = action.payload.message;
      state.messageType = action.payload.messageType;
      state.isSnackOpen = !state.isSnackOpen;
    },
    closeSnack: (state) => {
      state.isSnackOpen = false;
    },
    saveSelection: (state, action) => {
      state.selectedOriginalServiceHead = action.payload;
    },
    setParentItem: (state, action) => {
      state.parentItem = action.payload;
    },

    setChildItem: (state, action) => {
      state.childItem = action.payload;
    },
    toggleModal: (state, action) => {
      state.openModal = !state.openModal;
      state.modalTitle = action.payload.title;
      state.formMode = action.payload.formMode;
    },
    togglePopOver: (state, action) => {
      state.openPopOver = action.payload;
    },
    setUserRolePermissions: (state, action) => {
      state.userRolePermissions = action.payload;
    },
    setCurrentCompany: (state, action) => {
      // eslint-disable-next-line no-param-reassign
      state.currentCompany = action.payload;
    },
    setMainAccountToken: (state, action) => {
      state.mainAccountToken = action.payload.mainAccountToken;
      state.mainAccountRefreshToken = action.payload.mainAccountRefreshToken;
      state.mainAccountValidity = action.payload.mainAccountValidity;
      state.mainAccountRefreshValidity =
        action.payload.mainAccountRefreshValidity;
      state.mainAccountTokenType = action.payload.mainAccountTokenType;
    },
    toggleUploadModal: (state, action) => {
      state.openUploadModal = action.payload;
    },
  },
});

export const {
  setAuthUser,
  setUserInfo,
  setResponseMessage,
  closeSnack,
  saveSelection,
  setChildItem,
  setParentItem,
  toggleModal,
  togglePopOver,
  setUserRolePermissions,
  setCurrentCompany,
  setMainAccountToken,
  toggleUploadModal,
  reset: resetCore,
} = coreSlice.actions;

// exporting the reducer here, as we need to add this to the store
export default coreSlice.reducer;
