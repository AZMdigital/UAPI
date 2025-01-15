package com.azm.apihub.backend.packages.validator;

import com.azm.apihub.backend.entities.PackageType;
import com.azm.apihub.backend.packages.models.CreatePackageRequest;
import com.azm.apihub.backend.packages.models.UpdatePackageRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.ValidationUtils;
import org.springframework.validation.Validator;

@Component
@Slf4j
public class PackageUpdateRequestValidator implements Validator {

    @Override
    public boolean supports(@NonNull Class<?> clazz) {
        return clazz.isInstance(CreatePackageRequest.class) ? CreatePackageRequest.class.isAssignableFrom(clazz) : UpdatePackageRequest.class.isAssignableFrom(clazz);
    }

    @Override
    public void validate(@NonNull Object target, @NonNull Errors errors) {
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "name", "required.name", "Package name is required");
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "active", "required.active", "Active is required");
    }
}