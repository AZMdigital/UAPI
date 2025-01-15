package com.azm.apihub.backend.callback.validator;

import com.azm.apihub.backend.callback.models.ServiceCallbackTransactionRequest;
import com.azm.apihub.backend.companies.configurations.models.CompanyConfigurationRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.ValidationUtils;
import org.springframework.validation.Validator;

@Component
@Slf4j
public class ServiceCallbackRequestValidator implements Validator {

    @Override
    public boolean supports(@NonNull Class<?> clazz) {
        return ServiceCallbackTransactionRequest.class.isAssignableFrom(clazz);
    }

    @Override
    public void validate(@NonNull Object target, @NonNull Errors errors) {
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "companyId", "required.companyId", "Company Id is required");
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "serviceId", "required.serviceId", "Service Id is required");
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "transactionId", "required.transactionId", "Transaction Id is required");
    }
}
