package com.azm.apihub.backend.notifications.ResetPassword.services;

import com.azm.apihub.backend.notifications.ResetPassword.models.ResetPassword;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;

public interface ResetPasswordService {
    void sendResetPasswordEmail(UUID requestId, String email, HttpServletRequest httpServletRequest);
    void validateToken(String email, String token);
    void resetPassword(UUID requestId, ResetPassword resetPassword, HttpServletRequest httpServletRequest);
}
