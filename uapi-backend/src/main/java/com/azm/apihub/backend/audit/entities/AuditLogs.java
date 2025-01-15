package com.azm.apihub.backend.audit.entities;

import java.util.Date;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "audit_logs")
public class AuditLogs {
    @Id
    private String id;
    private long updatedModuleId;
    private String moduleName;
    private String action;
    private String oldValueJson;
    private String newValueJson;
    private String description;
    private String ipAddress;
    private Date createdAt;
    private Date updatedAt;
    private Long updatedByUserId;
    private Long updatedByCompanyId;
    private String updatedByUserName;
    private String updatedByCompanyName;
    private String updatedModuleName;
}


