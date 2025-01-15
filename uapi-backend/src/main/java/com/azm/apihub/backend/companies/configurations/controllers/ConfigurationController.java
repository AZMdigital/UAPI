package com.azm.apihub.backend.companies.configurations.controllers;

import com.azm.apihub.backend.companies.configurations.services.ConfigurationService;
import com.azm.apihub.backend.entities.Configuration;
import io.swagger.v3.oas.annotations.Operation;
import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping("/v1/configuration")
@Slf4j
public class ConfigurationController {

    @Autowired
    private ConfigurationService configurationService;

    @GetMapping
    @Operation (
            summary = "This API is used to get all configurations."
    )
    public ResponseEntity<List<Configuration>> getAllConfiguration() {

        var startMillis = System.currentTimeMillis();
        UUID requestId = UUID.randomUUID();
        log.info("Request received for getting all configurations with requestId: " + requestId);

        List<Configuration> result = configurationService.findAllConfiguration();

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Getting all configurations service took " + timeTook + " ms.");

        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}