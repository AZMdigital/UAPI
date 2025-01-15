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
public class CompanyCallbackConfig {
    private Long id;
    private String callbackUrl;
    private Long companyId;
    private Long serviceId;
    private String authHeaderKey;
    private String authHeaderValue;
    private String description;
    private Boolean isActive;
    private Timestamp createdAt;
    private Timestamp updatedAt;
    private String createdBy;
    private String updatedBy;
}