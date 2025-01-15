package com.azm.apihub.backend.callback.services;

import com.azm.apihub.backend.entities.ServiceCallback;

public interface ServiceCallbackService {
    ServiceCallback getServiceCallbackInfoTransactionId(String transactionId);
    ServiceCallback createCallbackEntry(Long companyId, Long serviceId, String transactionId);
    ServiceCallback updateCallbackEntry(String transactionId);
}
