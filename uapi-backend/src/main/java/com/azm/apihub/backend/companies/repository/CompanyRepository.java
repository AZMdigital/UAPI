package com.azm.apihub.backend.companies.repository;

import com.azm.apihub.backend.entities.Company;
import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface CompanyRepository extends JpaRepository<Company, Long> {
    List<Company> findAllByIsDeletedFalseAndAccountTypeOrderByIdDesc(String accountType);

    List<Company> findAllByMainAccountIdAndIsDeletedFalseOrderByIdDesc(Long mainAccountId);

    Long countCompaniesByIsActiveTrueAndIsDeletedFalse();
    Long countCompaniesByIsActiveFalseAndIsDeletedFalse();

    Optional<Company> findByIdAndIsDeletedFalse(Long id);
    Optional<Company> findByMainAccountIdAndIdAndIsDeletedFalse(Long mainAccountId, Long id);

    @Query("SELECT c.id from Company c where c.mainAccountId= :mainAccountId AND c.isDeleted = false")
    List<Long> findSubAccountIdsByMainAccountId(Long mainAccountId);

    @Transactional
    @Modifying
    @Query("UPDATE Company company SET company.isDeleted = true, company.deletedAt = :deletedAt WHERE company.id = :id AND company.isDeleted = false")
    void softDeleteById(@Param("id") Long id, @Param("deletedAt") Timestamp deletedAt);

    @Query("SELECT c FROM Company c WHERE c.isDeleted = false AND c.accountType = 'MAIN' AND (LOWER(c.companyName) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(c.companyWebsite) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(c.companyEmail) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Company> getSearchedCompanies(@Param("query") String query);

    @Query("SELECT c FROM Company c WHERE c.mainAccountId = :mainAccountId AND c.isDeleted = false AND (LOWER(c.companyName) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(c.companyWebsite) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(c.companyEmail) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Company> getSearchedSubAccountByCompanyId(@Param("query") String query, @Param("mainAccountId") Long mainAccountId);

    @Query("SELECT c.isActive from Company c where c.id= :id ")
    Boolean getActiveStatus(@Param("id") Long id);

    List<Company> findByCompanyNameOrCompanyEmailOrCompanyWebsiteOrUnifiedNationalNumberOrTaxNumberOrCommercialRegistry(
            String companyName, String companyEmail, String companyWebsite, String unifiedNationalNumber,
            String taxNumber, String commercialRegistry);

    List<Company> findByCompanyNameAndIsDeletedFalseAndIsActiveTrue(String companyName);
}