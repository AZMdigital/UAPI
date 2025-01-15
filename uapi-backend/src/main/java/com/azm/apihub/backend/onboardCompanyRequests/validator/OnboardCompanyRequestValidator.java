package com.azm.apihub.backend.onboardCompanyRequests.validator;

import com.azm.apihub.backend.onboardCompanyRequests.models.CompanyRequestDTO;
import java.time.Instant;
import java.time.chrono.HijrahDate;
import java.time.format.DateTimeFormatter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.ValidationUtils;
import org.springframework.validation.Validator;

import java.time.LocalDate;

@Component
@Slf4j
public class OnboardCompanyRequestValidator implements Validator {

    @Override
    public boolean supports(@NonNull Class<?> clazz) {
        return CompanyRequestDTO.class.isAssignableFrom(clazz);
    }

    @Override
    public void validate(@NonNull Object target, @NonNull Errors errors) {
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "companyName", "required.companyName", "Company name is required");
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "companyEmail", "required.companyEmail", "Company email is required");
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "companyTaxNumber", "required.companyTaxNumber", "Tax Number is required");
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "companyCommercialRegistry", "required.companyCommercialRegistry", "Commercial Registry is required");
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "companyUnifiedNationalNumber", "required.companyUnifiedNationalNumber", "Unified National Number is required");
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "companyIssueDate", "required.companyIssueDate", "Issue date is required");
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "companyExpiryDate", "required.companyExpiryDate", "Expiry date is required");
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "companySectorId", "required.companySectorId", "Sector ID is required");

        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "companyRepFirstName", "required.companyRepFirstName", "Company Representative's first name is required");
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "companyRepLastName", "required.companyRepLastName", "Company Representative's last name is required");
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "companyRepNationalId", "required.companyRepNationalId", "Company Representative's National ID is required");
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "companyRepEmail", "required.companyRepEmail", "Company Representative's email is required");
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "companyRepMobile", "required.companyRepMobile", "Company Representative's mobile is required");
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "companyRepCityId", "required.companyRepCityId", "Company Representative's City ID is required");

        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "companyAddressCountry", "required.companyAddressCountry", "Company address country is required");
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "companyAddressDistrict", "required.companyAddressDistrict", "Company address district is required");
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "companyAddressCityId", "required.companyAddressCityId", "Company address city ID is required");
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "companyAddressBuildingNumber", "required.companyAddressBuildingNumber", "Company address building number is required");
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "companyAddressPostalCode", "required.companyAddressPostalCode", "Company address postal code is required");

        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "companyUserFirstName", "required.companyUserFirstName", "Admin User's first name is required");
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "companyUserLastName", "required.companyUserLastName", "Admin User's last name is required");
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "companyUserNationalId", "required.companyUserNationalId", "Admin User's National ID is required");
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "companyUserUsername", "required.companyUserUsername", "Admin User's username is required");
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "companyUserEmail", "required.companyUserEmail", "Admin User's email is required");
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "companyUserContactNo", "required.companyUserContactNo", "Admin User's contact number is required");

        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "annualPackageId", "required.annualPackageId", "Annual package ID is required");

        String agreedToTerms = (String) errors.getFieldValue("agreedToTermsAndConditions");
        if (agreedToTerms == null || agreedToTerms.equals("false")) {
            errors.rejectValue("agreedToTermsAndConditions", "required.agreedToTermsAndConditions", "You must agree to the terms and conditions");
        }

        // Validate numeric fields
        validateNumericField(errors, "companyUnifiedNationalNumber", 10, true, "Your unified number must be ten numbers and start with 7");
        validateNumericField(errors, "companyCommercialRegistry", 10, false, "Your commercial registry number must be ten numbers");
        validateNumericField(errors, "companyTaxNumber", 15, false, "Tax Number should be numeric and have a length of 15");
        validateNumericField(errors, "companyRepNationalId", 10, false, "Company Representative's National ID should be numeric and have a length of 10");
        validateNumericField(errors, "companyAddressPostalCode", null, false, "Postal Code should be numeric");

        // Validate date fields
        CompanyRequestDTO companyRequest = (CompanyRequestDTO) target;
        LocalDate issueDate = companyRequest.getCompanyIssueDate();
        LocalDate expiryDate = companyRequest.getCompanyExpiryDate();

        if (issueDate != null && expiryDate != null && !expiryDate.isAfter(issueDate)) {
            errors.rejectValue("companyExpiryDate", "invalid.date", "Expiry date must be after the issue date");
        }

        if(expiryDate != null && !expiryDate.isAfter(LocalDate.now()))
            errors.rejectValue("companyExpiryDate", "invalid.date", "Your expiry date is outdated");
    }

    private void validateNumericField(Errors errors, String fieldName, Integer length, boolean mustStartWith7, String errorMessage) {
        String fieldValue = (String) errors.getFieldValue(fieldName);
        if (fieldValue != null) {
            if (!fieldValue.chars().allMatch(Character::isDigit) || (length != null && fieldValue.length() != length) || (mustStartWith7 && !fieldValue.startsWith("7"))) {
                errors.rejectValue(fieldName, "numeric." + fieldName, errorMessage);
            }
        }
    }
}