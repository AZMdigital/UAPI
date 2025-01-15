const authBaseUrl = "/users";
export const AUTH_ENDPOINTS = {
  login: `${authBaseUrl}/portal/token`,
  logout: `${authBaseUrl}/logout`,
  refreshToken: `${authBaseUrl}/refreshToken`,
  profile: `${authBaseUrl}/~`,
  forgotPassword: `/forgot-password?email=`,
  validateResetPassword: `/forgot-password/validate?email=`,
  resetPassword: `/forgot-password/reset`,
  setPassword: `/set-password`,
  validateSetPassword: `/set-password/validate?email=`,
};
