package com.azm.apihub.backend.onboardCompanyRequests.repository;

import com.azm.apihub.backend.entities.OnboardCompanyRequestAttachment;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CompanyRequestAttachmentRepository extends JpaRepository<OnboardCompanyRequestAttachment, Long> {
    @Query("SELECT a.id, a.name, a.description, a.updatedAt, a.createdAt, oca.attachmentType " +
            "FROM OnboardCompanyRequestAttachment oca " +
            "JOIN oca.attachment a " +
            "WHERE oca.onboardCompanyRequest.id = :onboardCompanyRequestId")
    List<Object[]> findCompanyAttachmentByOnboardCompanyRequestId(@Param("onboardCompanyRequestId") Long onboardCompanyRequestId);

    void deleteByOnboardCompanyRequestIdAndAttachmentId(Long onboardCompanyRequestId, Long attachmentId);

    void deleteByOnboardCompanyRequestId(Long onboardCompanyRequestId);

    int countByOnboardCompanyRequestId(Long onboardCompanyRequestId);
}