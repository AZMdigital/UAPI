package com.azm.apihub.backend.users.validator;

import com.azm.apihub.backend.users.models.TokenRequest;
import com.azm.apihub.backend.users.models.UpdateUserRequest;
import com.azm.apihub.backend.users.models.UserRequest;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.ValidationUtils;
import org.springframework.validation.Validator;

@Component
public class TokenRequestValidator implements Validator {

    @Override
    public boolean supports(@NonNull Class<?> clazz) {
        return clazz.isInstance(TokenRequest.class);
    }

    @Override
    public void validate(@NonNull Object target, @NonNull Errors errors) {
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "username", "required.username", "Username is required.");
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "password", "required.password", "Password is required.");
    }
}
