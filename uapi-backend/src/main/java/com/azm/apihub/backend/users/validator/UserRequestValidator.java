package com.azm.apihub.backend.users.validator;

import com.azm.apihub.backend.users.models.UpdateUserRequest;
import com.azm.apihub.backend.users.models.UserRequest;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.ValidationUtils;
import org.springframework.validation.Validator;

@Component
public class UserRequestValidator implements Validator {

    @Override
    public boolean supports(@NonNull Class<?> clazz) {
        return clazz.isInstance(UserRequest.class) ? UserRequest.class.isAssignableFrom(clazz) : UpdateUserRequest.class.isAssignableFrom(clazz);
    }

    @Override
    public void validate(@NonNull Object target, @NonNull Errors errors) {
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "firstName", "required.firstName", "First name is required.");
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "lastName", "required.lastName", "Last name is required.");
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "nationalId", "required.nationalId", "National Id is required.");
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "companyId", "required.companyId", "Company Id is required.");
        if(target.getClass().isInstance(UserRequest.class)) {
            ValidationUtils.rejectIfEmptyOrWhitespace(errors, "username", "required.username", "Username is required.");
            ValidationUtils.rejectIfEmptyOrWhitespace(errors, "email", "required.email", "Email is required.");
        }
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "contactNo", "required.contactNo", "Contact number is required.");
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "userType", "required.userType", "User Type is required.");
    }
}
