package com.azm.apihub.backend.callbackLogs.services;

import com.azm.apihub.backend.callbackLogs.models.CallbackLogsResponse;

import java.time.LocalDate;
import java.util.Date;

public interface CallbackLogsService {
        CallbackLogsResponse findAllLogs(Long serviceId, Long companyId, LocalDate fromDate, LocalDate toDate,
                                         int pageNumber, int pageSize, boolean applyPagination);

        void saveCallbackLogs(Long serviceId, Long companyId, String inboundRequestData, String outboundUrl,
                              String outboundRequestData, String outboundResponse, String header,
                              String error, Date inboundRequestReceivedAt, Date outboundRequestSentAt,
                              Date outboundResponseReceivedAt);

        boolean isUserAuthorized(Long companyId);
}
