package com.azm.apihub.backend.onboardCompanyRequests.controllers;

import com.azm.apihub.backend.ApiHubUtils;
import com.azm.apihub.backend.attachments.models.AttachmentRequest;
import com.azm.apihub.backend.attachments.validator.AttachmentRequestValidator;
import com.azm.apihub.backend.entities.Attachment;
import com.azm.apihub.backend.onboardCompanyRequests.services.CompanyRequestAttachmentService;
import io.swagger.v3.oas.annotations.Hidden;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.io.IOException;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/company-request-attachments")
@Tag(name = "Company Request Attachment Management")
@AllArgsConstructor
@Slf4j
public class CompanyRequestAttachmentController {

    @Autowired
    private CompanyRequestAttachmentService attachmentService;

    @Autowired
    private AttachmentRequestValidator attachmentRequestValidator;

    @GetMapping(value = "/{id}")
    @Operation(
            summary = "This service to get attachment by id.",
            parameters = {
                    @Parameter(name = "id", description = "The Id of the attachment"),
            }
    )
    public Attachment getAttachmentById(@PathVariable Long id ) {

        var startMillis = System.currentTimeMillis();
        UUID requestId = UUID.randomUUID();
        log.info("Request received for fetching company request attachment with requestId: {}", requestId);

        Attachment attachment = attachmentService.getAttachmentById(id);

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Fetching company request attachment service took {} ms.", timeTook);

        return attachment;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation (
            summary = "This API is used to add attachment for company request."
    )
    public ResponseEntity<Attachment> addAttachment(@ModelAttribute @Validated AttachmentRequest attachmentRequest,
                                                    BindingResult bindingResult)  throws IOException {

        var startMillis = System.currentTimeMillis();
        UUID requestId = UUID.randomUUID();
        log.info("Request received for adding attachment of company request with requestId: {}", requestId);

        // Validate the request.
        attachmentRequestValidator.validate(attachmentRequest, bindingResult);
        ApiHubUtils.checkRequestErrors(bindingResult);

        //Call attachment service to add the attachment to the database.
        Attachment addedAttachment = attachmentService.createAttachment(requestId, attachmentRequest);

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Add attachment service took {} ms.", timeTook);

        // Return the response.
        return new ResponseEntity<>(addedAttachment, HttpStatus.CREATED);
    }

    @GetMapping("/{attachmentId}/download")
    @Operation (
            summary = "This API is used to download attachment for company request."
    )
    public ResponseEntity<byte[]> downloadAttachment(@PathVariable Long attachmentId) {

        var startMillis = System.currentTimeMillis();
        UUID requestId = UUID.randomUUID();
        log.info("Request received for fetching attachment with requestId: {}", requestId);

        Attachment attachment = attachmentService.getAttachmentById(attachmentId);

        if (attachment != null) {
            byte[] attachmentData = attachment.getFile();

            // Add response headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", attachment.getName());

            var endMillis = System.currentTimeMillis();
            var timeTook = endMillis - startMillis;
            log.info("Fetching attachment service took {} ms.", timeTook);

            return new ResponseEntity<>(attachmentData, headers, HttpStatus.OK);
        }

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Attachment with Id {} not found.", attachmentId);
        log.info("Fetching attachment service took {} ms.", timeTook);

        return ResponseEntity.notFound().build();
    }

    @DeleteMapping(value = "/{id}")
    @Operation(
            summary = "This service to delete attachment by id.",
            parameters = {
                    @Parameter(name = "id", description = "The Id of the attachment"),
            }
    )
    @Hidden
    public ResponseEntity<HttpStatus> deleteAttachmentById(@PathVariable Long id ) {

        var startMillis = System.currentTimeMillis();
        UUID requestId = UUID.randomUUID();
        log.info("Request received for deleting attachment of company request with requestId: {}", requestId);

        attachmentService.deleteAttachment(id);

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Deleting attachment of company request service took {} ms.", timeTook);

        return new ResponseEntity<>(HttpStatus.OK);
    }
}