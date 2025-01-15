package com.azm.apihub.backend.callback.repositories;

import com.azm.apihub.backend.entities.CompanyCallbackConfig;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CompanyCallbackConfigRepository extends JpaRepository<CompanyCallbackConfig, Long> {

    Optional<CompanyCallbackConfig> findByCompanyIdAndServiceId(Long companyId, Long serviceId);

    boolean existsByCompanyIdAndServiceId(Long companyId, Long serviceId);

    List<CompanyCallbackConfig> findByCompanyId(Long companyId);
}