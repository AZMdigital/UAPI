package com.azm.apihub.backend.attachments.validator;

import com.azm.apihub.backend.attachments.models.AttachmentRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

@Component
@Slf4j
public class AttachmentRequestValidator implements Validator {

    private @Value("${attachment.types}") List<String> allowedContentTypesList;

    private Object target;

    @Override
    public boolean supports(Class<?> clazz) {
        return clazz.isInstance(AttachmentRequest.class);
    }

    @Override
    public void validate(Object target, Errors errors) {

        // Validate if the file field
        MultipartFile file = (MultipartFile) errors.getFieldValue("file");

        if (file == null || file.isEmpty() || !StringUtils.hasText(file.toString())) {
            errors.rejectValue("file", "required.file", (Object[]) null,
                    "Attachment file is required.");
        } else {
            // Check content type
            checkContentType(file, errors);

            // Check file size
            checkFileSize(file, errors);
        }
    }

    /**
     * Validate if the uploaded file content type either (pdf, docx or doc)
     * @param file
     * @param errors
     */
    private void checkContentType(MultipartFile file, Errors errors) {

        String contentType = file.getContentType();

        if(!allowedContentTypesList.contains(contentType)) {
            log.error("Invalid content type.");
            errors.rejectValue("file", "invalidType", (Object[]) null,
                    "Invalid file type. Allowed types: PDF, DOC, DOCX.");
        }
    }

    /**
     * Check the uploaded file size not to exceed 1 MB.
     * @param file
     * @param errors
     */
    public void checkFileSize(MultipartFile file, Errors errors) {

        long fileSizeInBytes = file.getSize();
        long fileSizeInKb = fileSizeInBytes / 1024;  // Convert bytes to kilobytes

        if (fileSizeInKb > 1024) {  // 1 MB = 1024 KB
            log.error("File exceeds the allowed limit. Maximum size is 1 MB.");
            errors.rejectValue("file", "exceedsSize", (Object[]) null,
                    "File exceeds the allowed limit. Maximum size is 1 MB.");
        }
    }

}