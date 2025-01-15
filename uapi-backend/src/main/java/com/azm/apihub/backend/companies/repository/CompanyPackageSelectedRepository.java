package com.azm.apihub.backend.companies.repository;

import com.azm.apihub.backend.entities.CompanyPackageSelected;
import com.azm.apihub.backend.entities.PackageStatus;
import com.azm.apihub.backend.entities.PackageType;
import java.math.BigDecimal;
import java.util.List;

import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface CompanyPackageSelectedRepository extends JpaRepository<CompanyPackageSelected, Long> {

    @Query("SELECT cps FROM CompanyPackageSelected cps WHERE cps.company.id = :companyId")
    Page<CompanyPackageSelected> findAllByCompanyId(Long companyId, Pageable pageable);

    Optional<CompanyPackageSelected> findByIdAndCompanyId(Long id, Long companyId);


    Page<CompanyPackageSelected> findAllByCompanyIdIn(List<Long> companyIds, Pageable pageable);

    @Query("SELECT cps FROM CompanyPackageSelected cps")
    Page<CompanyPackageSelected> findAllSelectedPackages(Pageable pageable);

    @Query("SELECT cps FROM CompanyPackageSelected cps INNER JOIN Package p ON cps.cPackage.id = p.id WHERE cps.company.id = :companyId" +
            " AND (LOWER(p.name) LIKE LOWER(CONCAT('%', :packageName, '%')) OR :packageName IS NULL)" +
            " AND (:packageStatus IS NULL OR cps.packageStatus = :packageStatus)" +
            " AND (:packageType is NULL or p.packageType= :packageType)")
    Page<CompanyPackageSelected> findAllSearchedByCompanyId(Long companyId, String packageName, Pageable pageable, PackageStatus packageStatus, PackageType packageType);


    @Query("SELECT cps FROM CompanyPackageSelected cps INNER JOIN Package p ON cps.cPackage.id = p.id" +
            " WHERE (:companyName IS NULL OR LOWER(cps.company.companyName) LIKE LOWER(concat('%', :companyName, '%'))) " +
            " AND (LOWER(p.name) LIKE LOWER(CONCAT('%', :packageName, '%')) OR :packageName IS NULL)" +
            " AND (:packageStatus IS NULL OR cps.packageStatus = :packageStatus)")
    Page<CompanyPackageSelected> findAllSearchedByCompanyName(String companyName, String packageName, Pageable pageable, PackageStatus packageStatus);
    @Query("SELECT cps FROM CompanyPackageSelected cps WHERE cps.company.id = :companyId")
    List<CompanyPackageSelected> findAllByCompanyIdWithoutPagination(Long companyId);

    @Transactional
    @Modifying
    @Query("UPDATE CompanyPackageSelected cps SET cps.priceConsumption = :consumedAmount " +
            "WHERE cps.company.id = :companyId AND cps.id = :companyPackageSelectedId ")
    void updateCompanyPackageSelectedPriceConsumption(
            @Param("companyId") Long companyId, @Param("companyPackageSelectedId") Long companyPackageSelectedId,
            @Param("consumedAmount") BigDecimal consumedAmount);
}