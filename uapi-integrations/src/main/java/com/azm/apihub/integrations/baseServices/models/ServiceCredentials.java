package com.azm.apihub.integrations.baseServices.models;

import java.sql.Timestamp;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ServiceCredentials {

    private Long id;

    private ServiceAuthType serviceAuthType;

    private String apiKey;

    private String username;

    private String password;

    private Timestamp createdAt;

    private String appId;
    
    private String token;

    private Boolean useClientCredentials;
}

