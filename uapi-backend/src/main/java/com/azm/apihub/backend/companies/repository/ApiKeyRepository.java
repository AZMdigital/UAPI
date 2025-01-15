package com.azm.apihub.backend.companies.repository;

import com.azm.apihub.backend.entities.ApiKey;
import com.azm.apihub.backend.entities.Company;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApiKeyRepository extends JpaRepository<ApiKey, Long> {

    Optional<ApiKey> findByCompanyId(Long companyId);

    void deleteByCompanyId(Long companyId);

    Optional<ApiKey> findByApiKey(String apiKey);

}