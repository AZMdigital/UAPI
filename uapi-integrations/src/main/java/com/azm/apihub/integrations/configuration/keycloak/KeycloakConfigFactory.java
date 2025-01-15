package com.azm.apihub.integrations.configuration.keycloak;

import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class KeycloakConfigFactory {
    @Autowired
    private KeycloakConfig keycloakConfig;

    @Bean
    public Keycloak keycloak() {
        return KeycloakBuilder.builder()
                .serverUrl(keycloakConfig.getAuthServerUrl())
                .realm(keycloakConfig.getRealm())
                .grantType(keycloakConfig.getGrantType())
                .clientId(keycloakConfig.getClientId())
                .clientSecret(keycloakConfig.getClientSecret())
                .build();

    }
}
