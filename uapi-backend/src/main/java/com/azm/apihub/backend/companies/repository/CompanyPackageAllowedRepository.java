package com.azm.apihub.backend.companies.repository;

import com.azm.apihub.backend.entities.CompanyPackageAllowed;
import com.azm.apihub.backend.entities.PackageType;
import java.util.List;
import java.util.Optional;
import javax.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CompanyPackageAllowedRepository extends JpaRepository<CompanyPackageAllowed, Long> {

    @Query("SELECT cpa FROM CompanyPackageAllowed cpa WHERE cpa.company.id = :companyId and cpa.aPackage.packageType = :packageType and cpa.aPackage.isActive = true")
    List<CompanyPackageAllowed> findAllByCompanyIdAndPackageType(Long companyId, PackageType packageType);


    @Query("SELECT cpa FROM CompanyPackageAllowed cpa WHERE cpa.company.id = :companyId and cpa.aPackage.id = :packageId and cpa.aPackage.isActive = true")
    Optional<CompanyPackageAllowed> findOneByCompanyIdAndPackageId(Long companyId, Long packageId);

    @Query("SELECT COUNT(cpa) > 0 FROM CompanyPackageAllowed cpa WHERE cpa.aPackage.id = :packageId")
    boolean existsByPackageId(Long packageId);

    @Transactional
    @Modifying
    @Query("DELETE FROM CompanyPackageAllowed cpa WHERE cpa.company.id = :companyId")
    void deleteAllPackagesByCompanyId(@Param("companyId") Long companyId);
}