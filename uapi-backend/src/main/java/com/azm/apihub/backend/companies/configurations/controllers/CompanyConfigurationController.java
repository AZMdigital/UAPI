package com.azm.apihub.backend.companies.configurations.controllers;

import com.azm.apihub.backend.ApiHubUtils;
import com.azm.apihub.backend.companies.configurations.models.CompanyConfigurationRequest;
import com.azm.apihub.backend.companies.configurations.services.CompanyConfigurationService;
import com.azm.apihub.backend.companies.configurations.services.ConfigurationService;
import com.azm.apihub.backend.companies.configurations.validator.CompanyConfigurationRequestValidator;
import com.azm.apihub.backend.configuration.rolesAndPermissions.RequiresPermission;
import com.azm.apihub.backend.entities.Company;
import com.azm.apihub.backend.entities.CompanyConfiguration;
import com.azm.apihub.backend.users.services.UserService;
import io.swagger.v3.oas.annotations.Operation;
import java.util.Optional;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping("/v1/company-configuration")
@Slf4j
public class CompanyConfigurationController {

    @Autowired
    private CompanyConfigurationService companyConfigurationService;

    @Autowired
    private UserService userService;

    @Autowired
    private CompanyConfigurationRequestValidator requestValidator;

    @PostMapping
    @Operation (
            summary = "This API is used to add configuration for the company."
    )
    @RequiresPermission({"configuration-edit"})
    public ResponseEntity<CompanyConfiguration> addCompanyConfiguration(Authentication authentication,
                                                                        @RequestBody @Validated CompanyConfigurationRequest request,
                                                                        BindingResult bindingResult) {

        var startMillis = System.currentTimeMillis();
        UUID requestId = UUID.randomUUID();
        log.info("Request received for adding/updating company configuration with requestId: " + requestId);

        requestValidator.validate(request, bindingResult);
        ApiHubUtils.checkRequestErrors(bindingResult);

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        Company company = userService.getUserByUsername(userDetails.getUsername()).getCompany();

        Optional<CompanyConfiguration> companyConfigurationResult = companyConfigurationService.findCompanyConfiguration(company, request.getConfigurationId());

        CompanyConfiguration companyConfiguration;
        HttpStatus httpStatus;

        if (companyConfigurationResult.isPresent()) {
            log.info("Updating existing configuration for the company");
            CompanyConfiguration companyConfig = companyConfigurationResult.get();
            companyConfiguration = companyConfigurationService.updateCompanyConfiguration(requestId, companyConfig, request);
            httpStatus = HttpStatus.OK;
        } else {
            log.info("Adding new configuration for the company");
            companyConfiguration = companyConfigurationService.addCompanyConfiguration(requestId, request, company);
            httpStatus = HttpStatus.CREATED;
        }

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Add/update Company configuration service took " + timeTook + " ms.");

        return new ResponseEntity<>(companyConfiguration, httpStatus);
    }

    @GetMapping("/{id}")
    @Operation (
            summary = "This API is used to get company configuration by company id and configuration name."
    )
    public ResponseEntity<CompanyConfiguration> getCompanyConfiguration(@PathVariable Long id,
                                                                        @RequestParam(name = "name", required = false) String  name) {

        var startMillis = System.currentTimeMillis();
        UUID requestId = UUID.randomUUID();
        log.info("Request received for getting company configuration with requestId: " + requestId +" and company id: "+id+" and configuration name: "+name);

        Optional<CompanyConfiguration> result = companyConfigurationService.findCompanyConfiguration(requestId, id, name);

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Getting configuration for company service took " + timeTook + " ms.");

        return new ResponseEntity<>(result.orElse(null), result.isEmpty() ? HttpStatus.NO_CONTENT: HttpStatus.OK);
    }
}