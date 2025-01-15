package com.azm.apihub.backend.companies.validator;

import com.azm.apihub.backend.ApiHubUtils;
import com.azm.apihub.backend.companies.models.CompanyRequest;
import com.azm.apihub.backend.companies.models.CompanyUpdateRequest;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.ValidationUtils;
import org.springframework.validation.Validator;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Objects;

@Component
@Slf4j
public class CompanyRequestValidator implements Validator {

    @Override
    public boolean supports(@NonNull Class<?> clazz) {
        return clazz.isInstance(CompanyRequest.class) ? CompanyRequest.class.isAssignableFrom(clazz) : CompanyUpdateRequest.class.isAssignableFrom(clazz);
    }

    @Override
    public void validate(@NonNull Object target, @NonNull Errors errors) {
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "companyName", "required.companyName", "Company name is required");
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "companyEmail", "required.companyEmail", "Company email is required");
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "commercialRegistry", "required.commercialRegistry", "Commercial Registry is required");
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "unifiedNationalNumber", "required.unifiedNationalNumber", "Unified National Number is required");
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "taxNumber", "required.taxNumber", "Tax Number is required");
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "issueDate", "required.issueDate", "Issue date is required");
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "expiryDate", "required.expiryDate", "Expiry date is required");
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "sectorId", "required.sectorId", "SectorId is required");
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "companyRep.firstName", "required.companyRep.firstName", "CompanyRep's firstName is required");
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "companyRep.lastName", "required.companyRep.lastName", "CompanyRep's lastName is required");
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "companyRep.nationalId", "required.companyRep.nationalId", "CompanyRep's nationalId is required");
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "companyRep.email", "required.companyRep.email", "CompanyRep's email is required");
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "companyRep.mobile", "required.companyRep.mobile", "CompanyRep's mobile is required");
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "companyRep.cityId", "required.companyRep.cityId", "CompanyRep's City is required");

        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "address.country", "required.address.country", "Address's country is required");
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "address.district", "required.address.district", "Address's district is required");
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "address.cityId", "required.address.cityId", "Address's city is required");
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "address.buildingNumber", "required.address.buildingNumber", "Address's buildingNumber is required");
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "address.postalCode", "required.address.postalCode", "Address's postalCode is required");

        String services= (String) errors.getFieldValue("services");

        if(services == null || services.isEmpty()) {
            ValidationUtils.rejectIfEmptyOrWhitespace(errors, "services", "required.services", "Atleast one service should be selected");
        }

        String allowedAnnualPackages= (String) errors.getFieldValue("allowedAnnualPackages");

        if(allowedAnnualPackages == null || allowedAnnualPackages.isEmpty()) {
            ValidationUtils.rejectIfEmptyOrWhitespace(errors, "allowedAnnualPackages", "required.allowedAnnualPackages", "Atleast one allowed annual package should be selected");
        }

        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "user.firstName", "required.user.firstName", "Admin User's firstName is required");
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "user.lastName", "required.user.lastName", "Admin User's lastName is required");
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "user.nationalId", "required.user.nationalId", "Admin User's nationalId is required");
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "user.contactNo", "required.user.contactNo", "Admin User's contactNo is required");

        String userNationalId = Objects.requireNonNull(errors.getFieldValue("user.nationalId")).toString();
        if (!isNumeric(userNationalId)) {
            errors.rejectValue("user.nationalId", "numeric.user.nationalId", "Admin User's National ID should be numeric");
        }

        if(errors.getFieldValue("user.nationalId") != null) {
            String nationalId = (String) errors.getFieldValue("user.nationalId");
            if (!isNumeric(nationalId)) {
                errors.rejectValue("user.nationalId", "numeric.user.nationalId", "Admin User's National ID should be numeric");
            }
        }

        if (target instanceof CompanyRequest) {
            ValidationUtils.rejectIfEmptyOrWhitespace(errors, "user.username", "required.user.username", "Admin User's username is required");
            ValidationUtils.rejectIfEmptyOrWhitespace(errors, "user.email", "required.user.email", "Admin User's email is required");
            ValidationUtils.rejectIfEmptyOrWhitespace(errors, "user.userType", "required.user.userType", "Admin User's userType is required");
        }


        if(errors.getFieldValue("commercialRegistry") != null) {
            String commercialRegistry = (String) errors.getFieldValue("commercialRegistry");
            if (!isNumeric(commercialRegistry) || commercialRegistry.length() != 10) {
                errors.rejectValue("commercialRegistry", "numeric.commercialRegistry", "Commercial Registry Number should be numeric and has length = 10");
            }
        }

        if(errors.getFieldValue("taxNumber") != null) {
            String taxNumber = (String) errors.getFieldValue("taxNumber");
            if (!isNumeric(taxNumber)) {
                errors.rejectValue("taxNumber", "numeric.taxNumber", "Tax Number should be numeric");
            }
        }

        if(errors.getFieldValue("unifiedNationalNumber") != null) {
            String unifiedNationalNumber = (String) errors.getFieldValue("unifiedNationalNumber");
            if (!isNumeric(unifiedNationalNumber) || unifiedNationalNumber.length() != 10 || !unifiedNationalNumber.startsWith("7")) {
                errors.rejectValue("unifiedNationalNumber", "numeric.unifiedNationalNumber", "Unified National Number should be numeric, should start with 7 and has length = 10");
            }
        }

        if(errors.getFieldValue("companyRep.nationalId") != null) {
            String nationalId = (String) errors.getFieldValue("companyRep.nationalId");
            if (!isNumeric(nationalId)) {
                errors.rejectValue("companyRep.nationalId", "numeric.companyRep.nationalId", "Company Representative National ID should be numeric");
            }
        }

        if(errors.getFieldValue("address.postalCode") != null) {
            String postalCode = (String) errors.getFieldValue("address.postalCode");
            if (!isNumeric(postalCode)) {
                errors.rejectValue("address.postalCode", "numeric.address.postalCode", "Postal code should be numeric");
            }
        }

        LocalDate issueDate = null;
        LocalDate expiryDate = null;
        if (target instanceof CompanyUpdateRequest) {
            // Check if expiry date is greater than issue date.
            CompanyUpdateRequest companyRequest = (CompanyUpdateRequest) target;
            issueDate = companyRequest.getIssueDate();
            expiryDate = companyRequest.getExpiryDate();
        } else {
            CompanyRequest companyRequest = (CompanyRequest) target;
            issueDate = companyRequest.getIssueDate();
            expiryDate = companyRequest.getExpiryDate();
        }

        log.info("Issue date: "+issueDate.toString());
        log.info("Expiry date: "+expiryDate.toString());

        if (!isExpiryAfterIssue(issueDate, expiryDate)) {
            log.error("Expiry date must be greater than issue date.");
            errors.rejectValue("expiryDate", "invalidType", (Object[]) null,
                    "Expiry date must be greater than issue date.");
        }
    }

    private boolean isExpiryAfterIssue(LocalDate issueDate, LocalDate expiryDate) {
        return expiryDate != null && issueDate != null && expiryDate.isAfter(issueDate);
    }

    private boolean isNumeric(String str) {
        if (str == null) {
            return false;
        }
        return str.chars().allMatch(Character::isDigit);
    }

}
