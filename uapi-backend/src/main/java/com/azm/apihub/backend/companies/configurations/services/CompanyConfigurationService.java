package com.azm.apihub.backend.companies.configurations.services;

import com.azm.apihub.backend.companies.configurations.models.CompanyConfigurationRequest;
import com.azm.apihub.backend.entities.Company;
import com.azm.apihub.backend.entities.CompanyConfiguration;
import java.util.Optional;
import java.util.UUID;

public interface CompanyConfigurationService {
    CompanyConfiguration addCompanyConfiguration(UUID requestId, CompanyConfigurationRequest request, Company company);

    Optional<CompanyConfiguration> findCompanyConfiguration(Company company, Long configurationId);

    Optional<CompanyConfiguration> findCompanyConfiguration(UUID requestId, Long companyId, String name);

    CompanyConfiguration updateCompanyConfiguration(UUID requestId, CompanyConfiguration companyConfiguration, CompanyConfigurationRequest request);
}
