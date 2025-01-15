package com.azm.apihub.backend.integrationLogs.services;

import com.azm.apihub.backend.integrationLogs.models.IntegrationRequestLogsResponse;
import com.azm.apihub.backend.integrationLogs.models.enums.RequestStatus;
import java.time.LocalDate;
import java.util.UUID;

public interface IntegrationRequestLogsService {
    IntegrationRequestLogsResponse findLogsByAccount(UUID requestId, Long accountId, String serviceName, RequestStatus status,
                                                     LocalDate fromDate, LocalDate toDate, int pageNumber, int pageSize);
}
