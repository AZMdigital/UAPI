package com.azm.apihub.backend.utilities.services;

import com.azm.apihub.backend.utilities.models.deed.DeedSuccessResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

@Slf4j
@Component
public class IntegrationService {

    private @Value("${integration.base-url}") String integrationBaseUrl;
    private @Value("${integration.deed-service}") String deedServiceUrl;

    @Autowired
    private RestTemplate restTemplate;

    private final String HEADER_ATTRIBUTE_API_KEY = "API-KEY";
    private final String HEADER_ATTRIBUTE_ACCOUNT_KEY = "ACCOUNT-KEY";

    protected Object getDeedInfo(String deedNumber, String idNumber, String idType, String apiKey) {

        UriComponents builder = UriComponentsBuilder.fromHttpUrl(integrationBaseUrl + deedServiceUrl)
                .buildAndExpand(deedNumber, idNumber, idType);
        HttpHeaders headers = new HttpHeaders();
        headers.set(HEADER_ATTRIBUTE_API_KEY, apiKey);

        HttpEntity<String> entity = new HttpEntity<>(null, headers);

        try {
            log.info("Calling Deed info API from Integration: {}", builder.toUriString());
            ResponseEntity<DeedSuccessResponse> responseEntity = restTemplate.exchange(builder.toUriString(), HttpMethod.GET, entity, DeedSuccessResponse.class);
            return responseEntity.getBody();
        } catch (HttpClientErrorException | HttpServerErrorException httpErrorException) {
            log.error(httpErrorException.getMessage());
            return httpErrorException.getResponseBodyAsString();
        }
    }
}
