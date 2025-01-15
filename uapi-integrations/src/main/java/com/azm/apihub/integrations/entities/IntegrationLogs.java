package com.azm.apihub.integrations.entities;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.sql.Timestamp;
import java.util.Date;

/**
 * @author Bashar Al-Shoubaki
 * @created 24/01/2024
 */

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


