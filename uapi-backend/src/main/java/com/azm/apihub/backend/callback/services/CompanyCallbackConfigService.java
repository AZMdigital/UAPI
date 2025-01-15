package com.azm.apihub.backend.callback.services;

import com.azm.apihub.backend.callback.models.CompanyCallbackConfigDTO;
import com.azm.apihub.backend.callback.models.CompanyCallbackConfigRequest;
import com.azm.apihub.backend.entities.Company;

import java.util.List;
import java.util.UUID;

public interface CompanyCallbackConfigService {
    CompanyCallbackConfigDTO getCallbackUrlByCompanyIdAndServiceId(UUID requestId, Long companyId, Long serviceId);

    CompanyCallbackConfigDTO addCompanyCallbackConfig(Company company, CompanyCallbackConfigRequest companyCallbackConfigRequest, String username, boolean isAdmin);

    CompanyCallbackConfigDTO updateCompanyCallbackConfig(Long id, Company company, CompanyCallbackConfigRequest companyCallbackConfigRequest,
                                                         String username, boolean isAdmin, boolean isSuperAdmin);

    List<CompanyCallbackConfigDTO> findCallbackInfoByCompany(Long companyId);

    List<CompanyCallbackConfigDTO> findAll();

    void deleteCompanyCallbackConfig(Long id, Long companyId, String username, boolean isAdmin, boolean isSuperAdmin);
}
