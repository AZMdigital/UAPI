package com.azm.apihub.backend.audit.services;

import com.azm.apihub.backend.audit.models.ApiHubUsernames;
import com.azm.apihub.backend.audit.models.AuditLogsResponse;
import com.azm.apihub.backend.entities.ApiHubModules;
import java.time.LocalDate;
import java.util.List;

public interface AuditLogsService {
    void saveAuditLogs(Long updatedModuleId, String updatedModuleName, String moduleName, String oldValue,
                       String newValue, String description, String ipAddress, String action);

    AuditLogsResponse getAuditLogs(Long accountId, String updatedByUsername, String moduleName, String action, LocalDate fromDate,
                                   LocalDate toDate, int pageNumber, int pageSize, boolean applyPagination);

    List<ApiHubModules> getAllModules();
    List<ApiHubUsernames> getAllUsernames(Long companyId);
}
