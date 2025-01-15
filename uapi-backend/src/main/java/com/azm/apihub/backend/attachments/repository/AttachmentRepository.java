package com.azm.apihub.backend.attachments.repository;

import com.azm.apihub.backend.entities.Attachment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AttachmentRepository extends JpaRepository<Attachment, Long> {
}
