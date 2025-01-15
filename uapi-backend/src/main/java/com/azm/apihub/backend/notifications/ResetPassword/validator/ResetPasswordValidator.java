package com.azm.apihub.backend.notifications.ResetPassword.validator;

import com.azm.apihub.backend.notifications.ResetPassword.models.ResetPassword;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.ValidationUtils;
import org.springframework.validation.Validator;

@Component
public class ResetPasswordValidator implements Validator {

    @Override
    public boolean supports(@NonNull Class<?> clazz) {
        return ResetPassword.class.isAssignableFrom(clazz);
    }

    @Override
    public void validate(@NonNull Object target, @NonNull Errors errors) {
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "email", "required.email", "Email is required.");
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "password", "required.password", "Password is required.");
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "token", "required.token", "Token is required.");
    }
}
