package com.azm.apihub.backend.onboardCompanyRequests.services;

import com.azm.apihub.backend.attachments.models.AttachmentRequest;
import com.azm.apihub.backend.attachments.repository.AttachmentRepository;
import com.azm.apihub.backend.entities.Attachment;
import com.azm.apihub.backend.exceptions.BadRequestException;
import java.io.IOException;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;

@Slf4j
@Service
public class CompanyRequestAttachmentServiceImpl implements CompanyRequestAttachmentService {

    private final AttachmentRepository attachmentRepository;

    private final String BAD_REQUEST_ATTACHMENT_DOES_NOT_EXIST = "Company Request Attachment not found";

    public CompanyRequestAttachmentServiceImpl(AttachmentRepository attachmentRepository) {
        this.attachmentRepository = attachmentRepository;
    }

    @Override
    public Attachment getAttachmentById(Long id) {
        return attachmentRepository.findById(id)
                .orElseThrow(() -> new BadRequestException(BAD_REQUEST_ATTACHMENT_DOES_NOT_EXIST));
    }

    @Override
    public Attachment createAttachment(UUID requestId, AttachmentRequest attachmentRequest) throws IOException {
        Attachment attachment = convertToEntity(attachmentRequest);
        Attachment addedAttachment = attachmentRepository.save(attachment);

        log.info("Attachment added successfully for company request...");

        return addedAttachment;
    }

    @Override
    public void deleteAttachment(Long id) {
        if (!attachmentRepository.existsById(id)) {
            throw new EntityNotFoundException("Attachment not found with ID: " + id);
        }
        attachmentRepository.deleteById(id);
    }

    private Attachment convertToEntity(AttachmentRequest attachmentRequest) throws IOException {

        Attachment attachment = new Attachment();

        if (attachmentRequest.getFile() == null || attachmentRequest.getFile().isEmpty()) {
            throw new BadRequestException("File is empty.");
        }

        attachment.setDescription(attachmentRequest.getDescription());
        attachment.setName(attachmentRequest.getFile().getOriginalFilename());
        attachment.setFile(attachmentRequest.getFile().getBytes());
        attachment.setCreatedAt(Timestamp.from(Instant.now()));
        attachment.setUpdatedAt(Timestamp.from(Instant.now()));

        return attachment;
    }
}