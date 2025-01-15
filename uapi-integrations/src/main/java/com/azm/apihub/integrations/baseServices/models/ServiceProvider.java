package com.azm.apihub.integrations.baseServices.models;

import java.sql.Timestamp;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ServiceProvider {
    private Long id;
    private String name;
    private Boolean requiresServiceHeadCredentials;
    private Boolean clientCredentialsAllowed;
    private Timestamp createdAt;
    private Timestamp updatedAt;
    private String createdBy;
    private String updatedBy;
    private List<ServiceAuthType> authTypes;
}
