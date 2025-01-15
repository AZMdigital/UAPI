package com.azm.apihub.backend.companies.services;

import com.azm.apihub.backend.companies.models.*;
import com.azm.apihub.backend.entities.ApiKey;
import com.azm.apihub.backend.entities.Company;
import com.azm.apihub.backend.entities.CompanyPackageAllowed;
import com.azm.apihub.backend.entities.CompanyPackageSelected;
import com.azm.apihub.backend.entities.PackageStatus;
import com.azm.apihub.backend.entities.PackageType;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CompanyService {
    List<Company> getCompanies(UUID requestId, Long mainAccountId, String query, String accountType);

    Company getCompanyById(UUID requestId, Long mainAccountId, Long companyId);

    void deleteCompany(UUID requestId, Long mainAccountId, Long companyId);

    Optional<ApiKey> findApiKey(UUID requestId, Long companyId);

    ApiKey findByApiKeyAndAccountKey(UUID requestId, String apiKey);

    ApiKey createAPIKey(UUID requestId, Company companyId);

    Company createCompanyWithAttachmentIds(UUID requestId, Long mainAccountId, CompanyRequest companyRequest);

    Company createSubAccount(UUID requestId, Long mainAccountId, SubAccountRequest subAccountRequest);

    Company updateCompanyWithAttachmentIds(UUID requestId, Long mainAccountId, Long companyId, CompanyUpdateRequest companyRequest);

    Company updateSubAccount(UUID requestId, Long mainAccountId, Long companyId, SubAccountRequest subAccountRequest);

    void subscribeAccountServiceHead(Long companyId, Long serviceHeadId);

    List<com.azm.apihub.backend.entities.CompanyService> findAllServiceHeadsByCompany(UUID requestId, Long companyId);

    List<CompanyPackageAllowed> findAllAllowedPackagesByCompany(UUID requestId, Long mainAccountId, Long companyId, PackageType packageType);

    CompanyPackageSelectedResponse findAllSelectedPackagesByCompany(UUID requestId, Long mainAccountId, Long companyId,
                                                                    String packageName, int pageNumber, int pageSize,
                                                                    PackageStatus packageStatus, PackageType packageType);

    List<CompanyPackageSelected> findAllSelectedPackagesByCompanyWithoutPagination(UUID requestId, Long companyId);

    void deleteApiKey(UUID requestId, Long companyId);

    CompanyPackageSelected assignPackageToCompany(UUID requestId, Company companyId, CompanyPackageRequest companyPackageRequest);

    CompanyPackageSelected updateSelectedPackageConsumption(UUID requestId, Long selectedPackageId, SelectedPackageUpdateConsumptionRequest selectedPackageUpdateConsumptionRequest);

    CompanyPackageSelectedResponse findAllSelectedPackages(UUID requestId, String accountName, String packageName, int pageNumber, int pageSize, PackageStatus packageStatus);

    Company subscribePostpaidBundle(Long id);

    SubscribedServiceResponse checkIsServiceSubscribed(UUID requestId, Long companyId, Long serviceId);

    IsServiceHeadSubscribe checkIsServiceHeadSubscribedByCompany(Long companyId, Long serviceHeadId);
}
