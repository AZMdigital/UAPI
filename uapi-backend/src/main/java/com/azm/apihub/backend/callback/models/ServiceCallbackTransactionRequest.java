package com.azm.apihub.backend.callback.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ServiceCallbackTransactionRequest {
    private Long companyId;
    private Long serviceId;
    private String transactionId;
}
