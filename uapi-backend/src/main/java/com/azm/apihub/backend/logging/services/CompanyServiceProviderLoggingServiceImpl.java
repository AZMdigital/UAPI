package com.azm.apihub.backend.logging.services;

import com.azm.apihub.backend.entities.*;
import com.azm.apihub.backend.logging.repositories.CompanyServiceProviderLoggingRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import com.azm.apihub.backend.users.models.UserDetails;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class CompanyServiceProviderLoggingServiceImpl implements CompanyServiceProviderLoggingService {
    private final CompanyServiceProviderLoggingRepository companyServiceProviderLoggingRepository;


    @Autowired
    public CompanyServiceProviderLoggingServiceImpl(CompanyServiceProviderLoggingRepository companyServiceProviderLoggingRepository) {
        this.companyServiceProviderLoggingRepository = companyServiceProviderLoggingRepository;
    }

    @Override
    public List<CompanyServiceProviderLogging> getServiceProviderLoggingInfo(UUID requestId, Long companyId) {
        return companyServiceProviderLoggingRepository.findAllByCompanyId(companyId);
    }

    @Override
    public CompanyServiceProviderLogging getServiceProviderLoggingInfo(UUID requestId, Long companyId, Long serviceProviderId) {
        return companyServiceProviderLoggingRepository.findAllByCompanyIdAndServiceProviderId(companyId, serviceProviderId);
    }

    @Override
    public void createLogs(Company company, List<Long> serviceProviderIds) {
        companyServiceProviderLoggingRepository.saveAll(serviceProviderIds.stream().map(ser -> convertToEntity(company, ser)).collect(Collectors.toList()));
    }

    @Override
    public void updateLogs(Company company, List<Long> serviceProviderIds) {
        companyServiceProviderLoggingRepository.deleteAllServicesProviderLoggingByCompanyId(company.getId());
        if(serviceProviderIds != null && !serviceProviderIds.isEmpty()) {
            companyServiceProviderLoggingRepository.saveAll(serviceProviderIds.stream().map(ser -> convertToEntity(company, ser)).collect(Collectors.toList()));
        }
    }

    private CompanyServiceProviderLogging convertToEntity(Company company, Long serviceProviderId) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = userDetails.getUsername();
        CompanyServiceProviderLogging companyServiceProvider = new CompanyServiceProviderLogging();
        ServiceProvider serviceProvider = new ServiceProvider();
        serviceProvider.setId(serviceProviderId);
        companyServiceProvider.setCreatedAt(Timestamp.from(Instant.now()));
        companyServiceProvider.setUpdatedAt(Timestamp.from(Instant.now()));
        companyServiceProvider.setCreatedBy(username);
        companyServiceProvider.setUpdatedBy(username);
        companyServiceProvider.setCompany(company);
        companyServiceProvider.setServiceProvider(serviceProvider);
        return companyServiceProvider;
    }

}