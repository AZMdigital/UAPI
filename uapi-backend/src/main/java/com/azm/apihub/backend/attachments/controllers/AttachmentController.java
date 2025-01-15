package com.azm.apihub.backend.attachments.controllers;

import com.azm.apihub.backend.ApiHubUtils;
import com.azm.apihub.backend.attachments.models.AttachmentRequest;
import com.azm.apihub.backend.attachments.services.AttachmentService;
import com.azm.apihub.backend.attachments.validator.AttachmentRequestValidator;
import com.azm.apihub.backend.entities.Attachment;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
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

import java.io.IOException;
import java.util.UUID;

@RestController
@AllArgsConstructor
@RequestMapping("/v1/attachments")
@Slf4j
public class AttachmentController {

    @RequestMapping("/test")
    public @ResponseBody String greeting() {
        return "Hello, World";
    }

    @Autowired
    AttachmentRequestValidator attachmentRequestValidator;

    @Autowired
    AttachmentService attachmentService;

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
        log.info("Request received for fetching attachment with requestId: " + requestId);

        Attachment attachment = attachmentService.getAttachemntById(id);

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Fetching attachment service took " + timeTook + " ms.");

        return attachment;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation (
            summary = "This API is used to add attachment."
    )
    public ResponseEntity<Attachment> addAttachemnt(@ModelAttribute @Validated AttachmentRequest attachmentRequest,
                                                    BindingResult bindingResult) throws IOException {

        var startMillis = System.currentTimeMillis();
        UUID requestId = UUID.randomUUID();
        log.info("Request received for adding attachment with requestId: " + requestId);

        // Validate the request.
        attachmentRequestValidator.validate(attachmentRequest, bindingResult);
        ApiHubUtils.checkRequestErrors(bindingResult);

        //Call attachment service to add the attachment to the database.
        Attachment addedAttachment = attachmentService.addAttachment(requestId, attachmentRequest);

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Add attachment service took " + timeTook + " ms.");

        // Return the response.
        return new ResponseEntity<>(addedAttachment, HttpStatus.CREATED);
    }

    @GetMapping("/{attachmentId}/download")
    public ResponseEntity<byte[]> downloadAttachment(@PathVariable Long attachmentId) {

        var startMillis = System.currentTimeMillis();
        UUID requestId = UUID.randomUUID();
        log.info("Request received for fetching attachment with requestId: " + requestId);

        Attachment attachment = attachmentService.getAttachemntById(attachmentId);

        if (attachment != null) {
            byte[] attachmentData = attachment.getFile();

            // Add response headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", attachment.getName());

            var endMillis = System.currentTimeMillis();
            var timeTook = endMillis - startMillis;
            log.info("Fetching attachment service took " + timeTook + " ms.");

            return new ResponseEntity<>(attachmentData, headers, HttpStatus.OK);
        }

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Attachment with Id " + attachmentId + " not found." );
        log.info("Fetching attachment service took " + timeTook + " ms.");

        return ResponseEntity.notFound().build();
    }

    @DeleteMapping(value = "/{id}")
    @Operation(
            summary = "This service to delete attachment by id.",
            parameters = {
                    @Parameter(name = "id", description = "The Id of the attachment"),
            }
    )
    public ResponseEntity deleteAttachmentById(@PathVariable Long id ) {

        var startMillis = System.currentTimeMillis();
        UUID requestId = UUID.randomUUID();
        log.info("Request received for deleting attachment with requestId: " + requestId);

        attachmentService.deleteAttachmentById(requestId, id);

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Deleting attachment service took " + timeTook + " ms.");

        return new ResponseEntity<>(HttpStatus.OK);
    }
}