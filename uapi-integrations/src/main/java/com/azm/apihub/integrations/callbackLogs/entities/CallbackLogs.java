package com.azm.apihub.integrations.callbackLogs.entities;

import java.util.Date;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "callback_logs")
public class CallbackLogs {
    @Id
    private String id;
    private String inboundEndpoint;
    private String inboundRequestData;
    private String authData;
    private Long companyId;
    private Long serviceId;
    private Long serviceCallbackId;
    private String outboundUrl;
    private String outboundRequestData;
    private String outboundResponse;
    private String header;
    private String payload;
    private String error;
    private Date createdAt;
    private Date inboundRequestReceivedAt;
    private Date OutboundRequestSentAt;
    private Date OutboundResponseReceivedAt;
}


