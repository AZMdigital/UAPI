package com.azm.apihub.backend.companyAttachment.repository;

import com.azm.apihub.backend.entities.AttachmentType;
import com.azm.apihub.backend.entities.CompanyAttachment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * @author Bashar Al-Shoubaki
 * @created 28/11/2023
 */
public interface CompanyAttachmentRepository extends JpaRepository<CompanyAttachment, Long> {

    Optional<CompanyAttachment> findByCompanyIdAndAttachmentType(Long id, AttachmentType attachmentType);

    @Query("SELECT a.id, a.name, a.description, a.updatedAt, a.createdAt, ca.attachmentType " +
            "FROM CompanyAttachment ca " +
            "JOIN ca.attachment a " +
            "WHERE ca.company.id = :companyId")
    List<Object[]> findCompanyAttachmentByCompanyId(@Param("companyId") Long companyId);

    @Query("SELECT a.id, a.name, a.description, a.updatedAt, a.createdAt, ca.attachmentType " +
            "FROM CompanyAttachment ca " +
            "JOIN ca.attachment a " +
            "WHERE ca.company.mainAccountId = :companyId AND ca.company.id = :subAccountId")
    List<Object[]> findCompanyAttachmentByCompanyIdAndSubAccountId(@Param("companyId") Long companyId, @Param("subAccountId") Long subAccountId);


    void deleteByCompanyIdAndAttachmentId(Long companyId, Long attachmentId);


}
