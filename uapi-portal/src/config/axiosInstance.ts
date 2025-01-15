/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable prefer-destructuring */
import axios from "axios";

import { responseMessageHandler } from "~/utils/helper";
import { labels } from "~/utils/labels";

import { store } from "~/state/store";

import { refreshAuthToken } from "~/rest/apiHooks/auth/useAuth";
import { AUTH_ENDPOINTS, SERVICES_ENDPOINTS } from "~/rest/endpoints";

// import { getPermissionsByRole } from "~/rest/repositories/roles";
import {
  setAuthUser,
  // setUserInfo,
  // setUserRolePermissions,
} from "~/core/state/coreSlice";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_HUB_PORTAL_URL,
});

export const swaggerAxioInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_HUB_PORTAL_INTEGRATION_URL,
});

const tokenlessUrls = [
  AUTH_ENDPOINTS.login,
  AUTH_ENDPOINTS.logout,
  AUTH_ENDPOINTS.refreshToken,
  AUTH_ENDPOINTS.forgotPassword,
  AUTH_ENDPOINTS.validateResetPassword,
  AUTH_ENDPOINTS.resetPassword,
  AUTH_ENDPOINTS.setPassword,
  AUTH_ENDPOINTS.validateSetPassword,
  SERVICES_ENDPOINTS.landingPageServices,
];

axiosInstance.interceptors.request.use(
  (config) => {
    const token = store.getState().core.token;

    if (
      config.url?.includes(AUTH_ENDPOINTS.forgotPassword) ||
      config.url?.includes(AUTH_ENDPOINTS.validateResetPassword) ||
      config.url?.includes(AUTH_ENDPOINTS.setPassword) ||
      config.url?.includes(AUTH_ENDPOINTS.validateSetPassword)
    ) {
      // Don't attach header in forgotPassword case
    } else if (!tokenlessUrls.includes(config.url!)) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    const refreshToken = store.getState().core.refreshToken;
    if (
      error?.config?.url === AUTH_ENDPOINTS.refreshToken &&
      error?.response?.status === labels.unAuthorizedCode
    ) {
      store.dispatch(
        setAuthUser({
          token: undefined,
          refreshToken: null,
          validity: null,
          refreshValidity: null,
          tokenType: null,
        })
      );
    } else if (
      error?.config?.url !== AUTH_ENDPOINTS.login &&
      error?.response?.status === labels.unAuthorizedCode &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const response = await refreshAuthToken(refreshToken!);
      if (response) {
        store.dispatch(setAuthUser({ ...response }));
        originalRequest.headers.Authorization = `Bearer ${response.token}`;
        return axiosInstance(originalRequest);
      }
    }

    if (error?.config?.url !== AUTH_ENDPOINTS.refreshToken) {
      const errorMessage =
        error?.response.data.error !== undefined
          ? error?.response.data.error
          : error?.message;

      responseMessageHandler(
        "error",
        errorMessage,
        error?.response.status,
        originalRequest?.url
      );
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
