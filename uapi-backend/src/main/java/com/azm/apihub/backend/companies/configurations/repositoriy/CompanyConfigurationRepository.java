package com.azm.apihub.backend.companies.configurations.repositoriy;

import com.azm.apihub.backend.entities.Company;
import com.azm.apihub.backend.entities.CompanyConfiguration;
import com.azm.apihub.backend.entities.Configuration;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CompanyConfigurationRepository extends JpaRepository<CompanyConfiguration, Long> {
    Optional<CompanyConfiguration> findByCompanyAndConfiguration(Company company, Configuration configuration);
    Optional<CompanyConfiguration> findByCompany(Company company);
}
