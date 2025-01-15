package com.azm.apihub.backend.onboardCompanyRequests.repository;

import com.azm.apihub.backend.entities.OnboardCompanyRequest;
import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface CompanyRequestRepository extends JpaRepository<OnboardCompanyRequest, Long> {

    List<OnboardCompanyRequest> findByCompanyNameOrCompanyEmailOrCompanyWebsiteOrCompanyUnifiedNationalNumberOrCompanyTaxNumberOrCompanyCommercialRegistry(
            String companyName, String companyEmail, String companyWebsite, String unifiedNationalNumber,
            String taxNumber, String commercialRegistry);

    @Query("SELECT ocr FROM OnboardCompanyRequest ocr WHERE ocr.companyCommercialRegistry = :number OR ocr.companyUnifiedNationalNumber = :number")
    Optional<OnboardCompanyRequest> findByCompanyCommercialRegistryOrCompanyUnifiedNationalNumberAndIsDeletedFalse(String number);

    Optional<OnboardCompanyRequest> findByIdAndIsDeletedFalse(Long id);

    @Transactional
    @Modifying
    @Query("UPDATE OnboardCompanyRequest cr SET cr.isDeleted = true, cr.deletedAt = :deletedAt WHERE cr.id = :id AND cr.isDeleted = false")
    void softDeleteById(@Param("id") Long id, @Param("deletedAt") Timestamp deletedAt);
}