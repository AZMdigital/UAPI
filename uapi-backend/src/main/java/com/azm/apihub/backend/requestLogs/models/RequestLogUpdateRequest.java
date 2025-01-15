package com.azm.apihub.backend.requestLogs.models;

import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RequestLogUpdateRequest {

    private UUID requestUuid;

    private Integer responseCode;

    private String method;

    private String errorDescription;

    private String errorCode;

    private Boolean isClientCredentialsUsed;

    private Boolean isMockup;

    private Long selectedPackageId;

}

