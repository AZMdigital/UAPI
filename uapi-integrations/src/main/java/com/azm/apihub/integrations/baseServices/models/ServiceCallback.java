package com.azm.apihub.integrations.baseServices.models;

import java.sql.Timestamp;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ServiceCallback {
    private Long id;
    private Long companyId;
    private Long serviceId;
    private String transactionId;
    private Boolean isCompleted;
    private Timestamp createdAt;
    private Timestamp updatedAt;
    private String createdBy;
    private String updatedBy;
}