package com.azm.apihub.backend.companies.validator;

import com.azm.apihub.backend.ApiHubUtils;
import com.azm.apihub.backend.companies.models.CompanyPackageRequest;
import com.azm.apihub.backend.companies.models.CompanyRequest;
import com.azm.apihub.backend.companies.models.CompanyUpdateRequest;
import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.ValidationUtils;
import org.springframework.validation.Validator;

@Component
@Slf4j
public class CompanyPackageRequestValidator implements Validator {

    @Override
    public boolean supports(@NonNull Class<?> clazz) {
        return CompanyPackageRequest.class.isAssignableFrom(clazz);
    }

    @Override
    public void validate(@NonNull Object target, @NonNull Errors errors) {
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "packageId", "required.packageId", "Package Id is required");
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "activationDate", "required.activationDate", "Activation date is required");

    }

}
