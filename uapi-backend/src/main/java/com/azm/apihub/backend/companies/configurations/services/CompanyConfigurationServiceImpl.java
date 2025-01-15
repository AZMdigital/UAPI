package com.azm.apihub.backend.companies.configurations.services;

import com.azm.apihub.backend.companies.configurations.models.CompanyConfigurationRequest;
import com.azm.apihub.backend.companies.configurations.repositoriy.CompanyConfigurationRepository;
import com.azm.apihub.backend.companies.configurations.repositoriy.ConfigurationRepository;
import com.azm.apihub.backend.companies.repository.CompanyRepository;
import com.azm.apihub.backend.entities.Company;
import com.azm.apihub.backend.entities.CompanyConfiguration;
import com.azm.apihub.backend.entities.Configuration;
import com.azm.apihub.backend.exceptions.BadRequestException;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Slf4j
@Service
public class CompanyConfigurationServiceImpl implements CompanyConfigurationService {

    @Autowired
    private ConfigurationRepository configurationRepository;

    @Autowired
    private CompanyConfigurationRepository companyConfigurationRepository;

    @Autowired
    private CompanyRepository companyRepository;

    private final String BAD_REQUEST_CONFIGURATION_DOES_NOT_EXIST = "Configuration does not exist";
    private final String BAD_REQUEST_COMPANY_DOES_NOT_EXIST = "Company does not exist";
    private final String BAD_REQUEST_COMPANY_CONFIGURATION_DOES_NOT_EXIST = "Configuration does not exist for this company";

    @Override
    public CompanyConfiguration addCompanyConfiguration(UUID requestId, CompanyConfigurationRequest request, Company company) {
        Optional<Configuration> configurationResult = configurationRepository.findById(request.getConfigurationId());
        if(configurationResult.isPresent()) {
            Configuration configuration = configurationResult.get();
            CompanyConfiguration companyConfiguration = new CompanyConfiguration();
            companyConfiguration.setConfiguration(configuration);
            companyConfiguration.setCompany(company);
            companyConfiguration.setConfigValue(request.getConfigurationValue());
            companyConfiguration.setCreatedAt(Timestamp.from(Instant.now()));

            return companyConfigurationRepository.save(companyConfiguration);
        } else
            throw new BadRequestException(BAD_REQUEST_CONFIGURATION_DOES_NOT_EXIST);
    }

    @Override
    public Optional<CompanyConfiguration> findCompanyConfiguration(Company company, Long configurationId) {
        Optional<Configuration> configurationResult = configurationRepository.findById(configurationId);
        if(configurationResult.isPresent())
            return companyConfigurationRepository.findByCompanyAndConfiguration(company, configurationResult.get());
        else
            throw new BadRequestException(BAD_REQUEST_COMPANY_CONFIGURATION_DOES_NOT_EXIST);
    }

    @Override
    public Optional<CompanyConfiguration> findCompanyConfiguration(UUID requestId, Long companyId, String name) {
        Optional<Company> companyResult = companyRepository.findById(companyId);
        if(companyResult.isPresent()) {
            Optional<Configuration> configurationResult = configurationRepository.findConfigurationsByHandle(name);
            return configurationResult.flatMap(config -> companyConfigurationRepository.findByCompanyAndConfiguration(companyResult.get(), config));
        } else
            throw new BadRequestException(BAD_REQUEST_COMPANY_DOES_NOT_EXIST);
    }

    @Override
    public CompanyConfiguration updateCompanyConfiguration(UUID requestId, CompanyConfiguration companyConfiguration, CompanyConfigurationRequest request) {
        companyConfiguration.setConfigValue(request.getConfigurationValue());
        companyConfiguration.setUpdatedAt(Timestamp.from(Instant.now()));
        return companyConfigurationRepository.save(companyConfiguration);

    }
}
