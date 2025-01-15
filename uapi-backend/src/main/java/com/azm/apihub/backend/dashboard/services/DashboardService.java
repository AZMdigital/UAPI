package com.azm.apihub.backend.dashboard.services;

import com.azm.apihub.backend.dashboard.models.NoOfAccountPerInvoiceStatusResult;
import com.azm.apihub.backend.dashboard.models.NoOfAccountsByPackagesResponse;
import com.azm.apihub.backend.dashboard.models.NoOfAccountsByServiceProviderResponse;
import com.azm.apihub.backend.dashboard.models.NoOfActiveAccountsResponse;
import com.azm.apihub.backend.dashboard.models.NoOfPrepaidAndPostpaidAccountsResponse;
import com.azm.apihub.backend.dashboard.models.ServicesCountByUserResponse;
import com.azm.apihub.backend.dashboard.models.NoOfInvoicesByStatusResponse;
import com.azm.apihub.backend.dashboard.models.TopConsumedServicesResponse;

import java.util.List;

public interface DashboardService {
    NoOfActiveAccountsResponse getNoOfActiveAccounts();
    List<NoOfAccountPerInvoiceStatusResult> getNoOfAccountsPerInvoiceStatus();
    List<NoOfAccountsByPackagesResponse> getNoOfAccountsByPackageType();
    List<NoOfAccountsByServiceProviderResponse> getNoOfAccountsByServiceProvider();
    NoOfPrepaidAndPostpaidAccountsResponse getNoOfPrepaidAndPostpaidAccounts();
    ServicesCountByUserResponse getServicesCountByByCompany(Long companyId);
    List<NoOfInvoicesByStatusResponse> getInvoiceCountByStatusAndCompany(Long companyId);
    List<TopConsumedServicesResponse> getTopConsumedServicesByCompany(Long companyId);
}
