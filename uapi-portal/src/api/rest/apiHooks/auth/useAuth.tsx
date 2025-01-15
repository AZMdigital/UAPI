/* eslint-disable @typescript-eslint/naming-convention */
import axiosInstance from "~/config/axiosInstance";

import { AUTH_ENDPOINTS } from "~/rest/endpoints";

export interface LoginInputType {
  username: string;
  password: string;
  remember?: boolean;
}

export interface validateResetPasswordType {
  email: string;
  token: string;
}

export interface resetPasswordType {
  email: string;
  token: string;
  password: string;
}

export const login = async (input: LoginInputType) => {
  const { username, password } = input;
  const { data: response } = await axiosInstance.post(AUTH_ENDPOINTS.login, {
    username,
    password,
  });
  return response;
};
export const logout = async (refreshToken: string) => {
  const { data: response } = await axiosInstance.get(AUTH_ENDPOINTS.logout, {
    headers: { refresh_token: refreshToken },
  });
  return response;
};

export const refreshAuthToken = async (refreshToken: string) => {
  const { data: response } = await axiosInstance.get(
    AUTH_ENDPOINTS.refreshToken,
    { headers: { refresh_token: refreshToken } }
  );
  return response;
};

export const getProfile = async () => {
  const { data: response } = await axiosInstance.get(AUTH_ENDPOINTS.profile);
  return response;
};

export const forgotPassword = async (email: string) => {
  const { data: response } = await axiosInstance.post(
    AUTH_ENDPOINTS.forgotPassword + email
  );
  return response;
};

export const validateResetPasswordLink = async (
  input: validateResetPasswordType
) => {
  const { email, token } = input;
  const { data: response } = await axiosInstance.post(
    `${AUTH_ENDPOINTS.validateResetPassword + email}&token=${token}`
  );
  return response;
};

export const validateSetPasswordLink = async (
  input: validateResetPasswordType
) => {
  const { email, token } = input;
  const { data: response } = await axiosInstance.post(
    `${AUTH_ENDPOINTS.validateSetPassword + email}&token=${token}`
  );
  return response;
};

export const resetPasswordLink = async (input: resetPasswordType) => {
  const { email, password, token } = input;
  const { data: response } = await axiosInstance.post(
    AUTH_ENDPOINTS.resetPassword,
    {
      email,
      password,
      token,
    }
  );
  return response;
};

export const setPasswordLink = async (input: resetPasswordType) => {
  const { email, password, token } = input;
  const { data: response } = await axiosInstance.post(
    AUTH_ENDPOINTS.setPassword,
    {
      email,
      password,
      token,
    }
  );
  return response;
};
