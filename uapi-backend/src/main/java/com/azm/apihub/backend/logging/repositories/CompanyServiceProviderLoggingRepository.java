package com.azm.apihub.backend.logging.repositories;

import com.azm.apihub.backend.entities.CompanyServiceProviderLogging;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import javax.transaction.Transactional;

public interface CompanyServiceProviderLoggingRepository extends JpaRepository<CompanyServiceProviderLogging, Long> {
    List<CompanyServiceProviderLogging> findAllByCompanyId(Long companyId);
    CompanyServiceProviderLogging findAllByCompanyIdAndServiceProviderId(Long companyId, Long serviceProviderId);

    @Transactional
    @Modifying
    @Query("DELETE FROM CompanyServiceProviderLogging cspl WHERE cspl.company.id = :companyId")
    void deleteAllServicesProviderLoggingByCompanyId(@Param("companyId") Long companyId);
}