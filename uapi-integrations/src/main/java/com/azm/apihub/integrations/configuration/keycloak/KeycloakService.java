package com.azm.apihub.integrations.configuration.keycloak;

import com.azm.apihub.integrations.configuration.dto.IntegrationTokenResponse;
import java.util.*;
import lombok.extern.slf4j.Slf4j;
import org.keycloak.OAuth2Constants;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.AccessTokenResponse;
import org.keycloak.representations.idm.MappingsRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.ws.rs.NotAuthorizedException;

@Slf4j
@Service
public class KeycloakService {

    private final Keycloak keycloak;
    private final KeycloakConfig keycloakConfig;

    @Autowired
    public KeycloakService(Keycloak keycloak, KeycloakConfig keycloakConfig) {
        this.keycloak = keycloak;
        this.keycloakConfig = keycloakConfig;
    }

    public IntegrationTokenResponse getIntegrationToken() {
        IntegrationTokenResponse userTokenResponse = null;
        var roles = getRolesMapping(keycloakConfig.getUsername());
        if(!roles.isEmpty() && roles.contains("ADMIN_ROLE")) {
            userTokenResponse = getToken(keycloakConfig.getUsername(), keycloakConfig.getPassword());
        } else {
            throw new NotAuthorizedException("Integration Service account does not have permission to perform this action");
        }

        return userTokenResponse;
    }

    private IntegrationTokenResponse getToken(String username, String password) {
        AccessTokenResponse tokenResponse;
        try (Keycloak keycloak = KeycloakBuilder.builder()
                .serverUrl(keycloakConfig.getAuthServerUrl())
                .realm(keycloakConfig.getRealm())
                .clientId(keycloakConfig.getClientId())
                .clientSecret(keycloakConfig.getClientSecret())
                .username(username)
                .password(password)
                .grantType(OAuth2Constants.PASSWORD)
                .build()) {

            // Obtain user token and refresh token
            tokenResponse = keycloak.tokenManager().getAccessToken();
        }
        String userToken = tokenResponse.getToken();
        String refreshToken = tokenResponse.getRefreshToken();
        long expiresIn = tokenResponse.getExpiresIn();
        long refreshExpiresIn = tokenResponse.getRefreshExpiresIn();
        String tokenType = tokenResponse.getTokenType();

        log.info("User Token: {}", userToken);
        log.info("Refresh Token: {}", refreshToken);
        log.info("Type: {}", tokenType);
        log.info("Expires In: {}", new Date(expiresIn));

        return new IntegrationTokenResponse(userToken, refreshToken, expiresIn, refreshExpiresIn, tokenType);
    }

    private List<String> getRolesMapping(String username) {
        var userRepresentations = getUser(username);
        List<String> roleRepresentations = new ArrayList<>();

        if(userRepresentations != null && !userRepresentations.isEmpty()) {
            var userRepresentation = userRepresentations.get(0);
            MappingsRepresentation mappingsRepresentation = getUsersResourceFromRealm().get(userRepresentation.getId()).roles().getAll();
            var userRealmRoles = mappingsRepresentation.getRealmMappings();

            if(userRealmRoles != null && !userRealmRoles.isEmpty()) {
                userRealmRoles.forEach(it -> {
                    log.info("Role: "+it.getName());
                    roleRepresentations.add(it.getName());
                });
            }
        }
        return roleRepresentations;
    }

    private RealmResource getRealmResource() {
        return keycloak.realm(keycloakConfig.getRealm());
    }

    private UsersResource getUsersResourceFromRealm() {
        return getRealmResource().users();
    }

    public List<UserRepresentation> getUser(String userName) {
        return getUsersResourceFromRealm().search(userName, true);
    }

}
