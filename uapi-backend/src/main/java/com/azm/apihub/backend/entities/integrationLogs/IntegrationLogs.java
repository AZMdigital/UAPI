package com.azm.apihub.backend.entities.integrationLogs;

import java.util.Date;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "integration_logs")
public class IntegrationLogs {
    @Id
    private String id;
    private long serviceHead;
    private String service;
    private String url;
    private long accountId;
    private Request request;
    private Response response;
    private Date requestTime;
    private Date responseTime;
}


