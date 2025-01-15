package com.azm.apihub.backend.logging.controllers;

import com.azm.apihub.backend.entities.CompanyServiceProviderLogging;
import com.azm.apihub.backend.logging.services.CompanyServiceProviderLoggingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/v1/logging")
@Tag(name = "Logging management")
@AllArgsConstructor
@Slf4j
public class LoggingController {

    private final CompanyServiceProviderLoggingService companyServiceProviderLoggingService;

    @GetMapping(value = "/{companyId}")
    @Operation(
            summary = "This Api is used to get all Service providers who have logging enabled by company id"
    )

    public ResponseEntity<List<CompanyServiceProviderLogging>> findAllServiceProviders(@PathVariable Long companyId) {
        var startMillis = System.currentTimeMillis();
        UUID requestID = UUID.randomUUID();

        log.info("Request received for getting all service providers who have logging enabled  requestId:" + requestID +" and companyId = "+companyId);

        var result = companyServiceProviderLoggingService.getServiceProviderLoggingInfo(requestID, companyId);

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Get all service providers with logging enabled service took " + timeTook + " ms");

        return new ResponseEntity<>(result, HttpStatus.OK);

    }

    @GetMapping(value = "/{companyId}/{serviceProviderId}")
    @Operation(
            summary = "This Api is used to get all Service providers who have logging enabled by company id"
    )

    public ResponseEntity<CompanyServiceProviderLogging> findServiceProviderById(@PathVariable Long companyId, @PathVariable Long serviceProviderId) {
        var startMillis = System.currentTimeMillis();
        UUID requestID = UUID.randomUUID();

        log.info("Request received for getting service provider by id who have logging enabled  requestId:" + requestID +" and companyId = "+companyId);

        var result = companyServiceProviderLoggingService.getServiceProviderLoggingInfo(requestID, companyId, serviceProviderId);

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Get all service provider by id with logging enabled service took " + timeTook + " ms");

        return new ResponseEntity<>(result, HttpStatus.OK);

    }
}