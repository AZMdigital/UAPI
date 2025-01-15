package com.azm.apihub.backend.attachments.services;

import com.azm.apihub.backend.attachments.models.AttachmentRequest;
import com.azm.apihub.backend.entities.Attachment;

import java.io.IOException;
import java.util.Optional;
import java.util.UUID;

public interface AttachmentService {

    Attachment addAttachment(UUID requestId, AttachmentRequest attachmentRequest) throws IOException;

    Attachment getAttachemntById(Long id);

    void deleteAttachmentById(UUID requestId, Long id);
}
