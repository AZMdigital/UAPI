package com.azm.apihub.integrations.callbackLogs.services;

public interface CallbackLogsService {
    void saveInboundCallbackLogs(String requestId, String url, String requestJson, String authData);
    void saveInboundCallbackLogs(String requestId, String header, String payload);
    void saveOutboundCallbackLogs(String requestId, String url, String requestJson, Long companyId, Long serviceId, Long serviceCallbackId);
    void saveOutboundCallbackLogs(String requestId, String response);
    void saveOutboundCallbackLogsError(String requestId, String error);
}
