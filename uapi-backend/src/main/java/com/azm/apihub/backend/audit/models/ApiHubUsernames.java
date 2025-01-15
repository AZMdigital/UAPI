package com.azm.apihub.backend.audit.models;

import com.azm.apihub.backend.audit.entities.AuditLogs;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ApiHubUsernames {
    private Long userId;
    private String username;
}