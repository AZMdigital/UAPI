package com.azm.apihub.backend.companies.configurations.validator;

import com.azm.apihub.backend.companies.configurations.models.CompanyConfigurationRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.ValidationUtils;
import org.springframework.validation.Validator;

@Component
@Slf4j
public class CompanyConfigurationRequestValidator implements Validator {

    @Override
    public boolean supports(@NonNull Class<?> clazz) {
        return CompanyConfigurationRequest.class.isAssignableFrom(clazz);
    }

    @Override
    public void validate(@NonNull Object target, @NonNull Errors errors) {
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "configurationId", "required.configurationId", "Configuration Id is required");
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "configurationValue", "required.configurationValue", "Configuration value is required");

    }
}
