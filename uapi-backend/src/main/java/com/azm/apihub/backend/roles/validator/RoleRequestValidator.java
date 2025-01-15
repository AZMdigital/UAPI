package com.azm.apihub.backend.roles.validator;

import com.azm.apihub.backend.roles.models.RoleRequest;
import com.azm.apihub.backend.roles.models.UpdateRoleRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.ValidationUtils;
import org.springframework.validation.Validator;

@Component
@Slf4j
public class RoleRequestValidator implements Validator {

    @Override
    public boolean supports(@NonNull Class<?> clazz) {
        return clazz.isInstance(RoleRequest.class) ? RoleRequest.class.isAssignableFrom(clazz) : UpdateRoleRequest.class.isAssignableFrom(clazz);
    }

    @Override
    public void validate(@NonNull Object target, @NonNull Errors errors) {
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "name", "required.name", "Role name is required");
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "active", "required.active", "Role active flag is required");

        String permissions = (String) errors.getFieldValue("permissions");

        if (permissions == null || permissions.isEmpty()) {
            ValidationUtils.rejectIfEmptyOrWhitespace(errors, "permissions", "required.permissions", "Atleast one allowed permission should be selected");
        }
    }

}
