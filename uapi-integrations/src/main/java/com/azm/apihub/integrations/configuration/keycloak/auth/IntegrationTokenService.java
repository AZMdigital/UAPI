package com.azm.apihub.integrations.configuration.keycloak.auth;

import com.azm.apihub.integrations.configuration.dto.IntegrationTokenResponse;
import com.azm.apihub.integrations.configuration.keycloak.KeycloakService;
import java.util.Objects;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class IntegrationTokenService {

    private final KeycloakService keycloakService;
    private final CacheManager cacheManager;

    public IntegrationTokenService(KeycloakService keycloakService, CacheManager cacheManager) {
        this.keycloakService = keycloakService;
        this.cacheManager = cacheManager;
    }

    @Cacheable(value = "integrationTokenCache", key = "'backendAuthResponse'")
    public IntegrationTokenResponse getAuthTokenFromBackend() {
        log.info("Backend Access token is not in cache, Calling Keycloak to get token for integration service account");
        return keycloakService.getIntegrationToken();
    }

    @Scheduled(fixedRate = 300000) // Refresh every 5 minutes = 5 * 60 * 1000 = 3600000
    public void evictAuthResponse() {
        log.info("Evicting Access token for integration service account");
        Objects.requireNonNull(cacheManager.getCache("integrationTokenCache")).evict("backendAuthResponse");
    }
}
