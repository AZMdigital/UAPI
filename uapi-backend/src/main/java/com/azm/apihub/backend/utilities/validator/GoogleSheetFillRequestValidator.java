package com.azm.apihub.backend.utilities.validator;

import com.azm.apihub.backend.services.models.SaveCredentialsRequest;
import com.azm.apihub.backend.utilities.models.GoogleSheetFillRequest;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.ValidationUtils;
import org.springframework.validation.Validator;

@Component
public class GoogleSheetFillRequestValidator implements Validator {

    @Override
    public boolean supports(@NonNull Class<?> clazz) {
        return clazz.isInstance(GoogleSheetFillRequest.class);
    }

    @Override
    public void validate(@NonNull Object target, @NonNull Errors errors) {
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "sheetUrl", "required.sheetUrl", "Sheet Url is required");
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "accountId", "required.accountId", "Account Id is required");
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "sheetColumnAlphabet", "required.sheetColumnAlphabet", "Sheet Column Alphabet is required");
    }
}
