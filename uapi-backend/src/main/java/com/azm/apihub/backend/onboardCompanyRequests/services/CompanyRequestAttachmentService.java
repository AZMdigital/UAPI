package com.azm.apihub.backend.onboardCompanyRequests.services;

import com.azm.apihub.backend.attachments.models.AttachmentRequest;
import com.azm.apihub.backend.entities.Attachment;
import java.io.IOException;
import java.util.UUID;

public interface CompanyRequestAttachmentService {
    Attachment getAttachmentById(Long id);
    Attachment createAttachment(UUID requestId, AttachmentRequest attachmentRequest) throws IOException;
    void deleteAttachment(Long id);
}