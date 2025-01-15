package com.azm.apihub.backend.requestLogs.services;

import com.azm.apihub.backend.entities.Company;
import com.azm.apihub.backend.entities.RequestLogs;
import com.azm.apihub.backend.entities.Service;
import com.azm.apihub.backend.entities.ServiceHead;
import com.azm.apihub.backend.requestLogs.models.RequestLogUpdateRequest;
import java.util.UUID;

public interface RequestLogsService {
    RequestLogs addRequestLog(UUID requestId, Company company, Service serviceHead, String method, Boolean isClientCredentialsUsed,
                              Boolean isMockup, Boolean isPostpaid);
    RequestLogs updateRequestLog(UUID requestId, RequestLogUpdateRequest request);
}
