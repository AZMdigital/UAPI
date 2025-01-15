package com.azm.apihub.backend.callback.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Timestamp;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CompanyCallbackConfigDTO {
    private Long id;
    private String callbackUrl;
    private Long companyId;
    private String companyName;
    private Long serviceId;
    private String serviceName;
    private String authHeaderKey;
    private String authHeaderValue;
    private String description;
    private Boolean isActive;
    private Timestamp createdAt;
    private Timestamp updatedAt;
    private String createdBy;
    private String updatedBy;
}
