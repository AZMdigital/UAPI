package com.azm.apihub.backend;

import com.azm.apihub.backend.exceptions.BadRequestException;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.*;
import lombok.experimental.UtilityClass;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;

@UtilityClass
@Slf4j
public class ApiHubUtils {
    public void checkRequestErrors(BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            List<String> errorMessages = new ArrayList<>();
            for (FieldError error : bindingResult.getFieldErrors()) {
                if(error.getDefaultMessage() != null && error.getDefaultMessage().trim().length() > 0) {
                    errorMessages.add(error.getDefaultMessage());
                } else {
                    errorMessages.add("Missing parameters: " + String.format("%s is required.", error.getField()));
                }
            }
            throw new BadRequestException(String.join(", ", errorMessages));
        }
    }

    public LocalDate parseDateWithFormats(String dateStr, List<String> formatPatterns) {
        for (String format : formatPatterns) {
            try {
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern(format);
                return LocalDate.parse(dateStr, formatter); // Return the parsed date if successful
            } catch (DateTimeParseException e) {
                log.error("Error occurred while parsing date: "+e.getMessage());
            }
        }
        return null;
    }

    public String getAccountCode(String unifiedNationalNumber, Long id) {
        if(unifiedNationalNumber != null)
            return "ACC_"+unifiedNationalNumber.substring(unifiedNationalNumber.length() - 3) + id;
        else {
            Random random = new Random();
            int randomNumber = 100 + random.nextInt(900);
            return "ACC_" + randomNumber + id;
        }
    }

    public String extractSpreadsheetId(String url) {
        String[] parts = url.split("/");
        if (parts.length >= 7 && "spreadsheets".equals(parts[3]) && "d".equals(parts[4])) {
            return parts[5];
        }
        return null; // Return null if the URL format doesn't match
    }
}
