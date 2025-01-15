package com.azm.apihub.integrations.configuration.keycloak;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "keycloak")
public class KeycloakConfig {
    private String authServerUrl;
    private String realm;
    private String grantType;
    private String clientId;
    private String clientSecret;
    private String groups;
    private String username;
    private String password;
}
