package com.azm.apihub.backend.attachments.services;

import com.azm.apihub.backend.attachments.repository.AttachmentRepository;
import com.azm.apihub.backend.attachments.models.AttachmentRequest;
import com.azm.apihub.backend.entities.Attachment;
import com.azm.apihub.backend.exceptions.BadRequestException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
public class AttachmentServiceImpl implements AttachmentService {

    private final String BAD_REQUEST_FILE_IS_EMPTY = "File is empty.";
    private final String BAD_REQUEST_ATTACHMENT_DOES_NOT_EXIST = "Attachment does not exist.";

    @Autowired
    AttachmentRepository attachmentRepository;

    @Override
    public Attachment addAttachment(UUID requestId, AttachmentRequest attachmentRequest) throws IOException {

        Attachment attachment = convertToEntity(attachmentRequest);
        Attachment addedAttachment = attachmentRepository.save(attachment);

        log.info("Attachment added successfully...");

        return addedAttachment;
    }

    @Override
    public Attachment getAttachemntById(Long id) {
        Optional<Attachment> attachment =  attachmentRepository.findById(id);
        return attachment.orElseThrow(() -> new BadRequestException(BAD_REQUEST_ATTACHMENT_DOES_NOT_EXIST));
    }

    /**
     * @param requestId
     * @param id
     */
    @Override
    public void deleteAttachmentById(UUID requestId, Long id) {
        Optional<Attachment> attachment =  attachmentRepository.findById(id);

        if(attachment.isPresent()) {
            attachmentRepository.deleteById(id);
        } else {
            throw new BadRequestException(BAD_REQUEST_ATTACHMENT_DOES_NOT_EXIST);
        }

    }

    /**
     * This method to fill the attachment object
     * @param attachmentRequest
     * @return Attachment
     */
    private Attachment convertToEntity(AttachmentRequest attachmentRequest) throws IOException {

        Attachment attachment = new Attachment();

        if (attachmentRequest.getFile() == null || attachmentRequest.getFile().isEmpty()) {
            throw new BadRequestException(BAD_REQUEST_FILE_IS_EMPTY);
        }

        attachment.setDescription(attachmentRequest.getDescription());
        attachment.setName(attachmentRequest.getFile().getOriginalFilename());
        attachment.setFile(attachmentRequest.getFile().getBytes());
        attachment.setCreatedAt(Timestamp.from(Instant.now()));
        attachment.setUpdatedAt(Timestamp.from(Instant.now()));

        return attachment;
    }
}
