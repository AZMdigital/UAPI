package com.azm.apihub.backend.logging.services;

import com.azm.apihub.backend.entities.Company;
import com.azm.apihub.backend.entities.CompanyServiceProviderLogging;
import java.util.List;
import java.util.UUID;

public interface CompanyServiceProviderLoggingService {
    List<CompanyServiceProviderLogging> getServiceProviderLoggingInfo(UUID requestId, Long companyId);
    CompanyServiceProviderLogging getServiceProviderLoggingInfo(UUID requestId, Long companyId, Long serviceProviderId);
    void createLogs(Company company, List<Long> serviceProviderIds);
    void updateLogs(Company company, List<Long> serviceProviderIds);

}