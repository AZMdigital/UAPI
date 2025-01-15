package com.azm.apihub.backend.requestLogs.validator;

import com.azm.apihub.backend.requestLogs.models.RequestLogAddRequest;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.ValidationUtils;
import org.springframework.validation.Validator;

@Component
public class RequestLogValidator implements Validator {

    @Override
    public boolean supports(@NonNull Class<?> clazz) {
        return RequestLogAddRequest.class.isAssignableFrom(clazz);
    }

    @Override
    public void validate(@NonNull Object target, @NonNull Errors errors) {
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "requestUuid", "required.requestUuid", "Request uuid is required");
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "companyId", "required.companyId", "Company id is required");
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "serviceId", "required.serviceId", "Service id is required");
    }
}
