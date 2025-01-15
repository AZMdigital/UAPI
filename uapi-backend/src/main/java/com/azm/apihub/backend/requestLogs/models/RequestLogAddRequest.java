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
public class RequestLogAddRequest {

    private UUID requestUuid;

    private long companyId;

    private long serviceId;

    private String method;

    private Boolean isClientCredentialsUsed;

    private Boolean isMockup;

    private Boolean isPostpaid;

}

