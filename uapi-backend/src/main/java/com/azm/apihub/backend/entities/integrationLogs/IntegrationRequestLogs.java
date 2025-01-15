package com.azm.apihub.backend.entities.integrationLogs;

import java.util.Date;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "integration_logs")
public class IntegrationRequestLogs {
    @Id
    private String id;
    private Long accountId;
    private String request;
    private String response;
    private String service;
    private Long serviceHead;
    private String url;
    private Date requestTime;
    private Date responseTime;
}


