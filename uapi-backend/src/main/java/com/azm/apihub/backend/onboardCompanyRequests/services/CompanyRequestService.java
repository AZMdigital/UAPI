package com.azm.apihub.backend.onboardCompanyRequests.services;

import com.azm.apihub.backend.entities.OnboardCompanyRequest;
import com.azm.apihub.backend.onboardCompanyRequests.models.CompanyRequestDTO;
import java.util.List;

public interface CompanyRequestService {
    List<OnboardCompanyRequest> getAllCompanyRequests();
    OnboardCompanyRequest createCompanyRequest(CompanyRequestDTO companyRequest);
    OnboardCompanyRequest getCompanyRequestById(Long id);
    OnboardCompanyRequest getCompanyRequestByRequestNumber(String number);
    OnboardCompanyRequest updateCompanyRequest(Long id, CompanyRequestDTO companyRequestDTO);
    void deleteCompanyRequest(Long id);
}