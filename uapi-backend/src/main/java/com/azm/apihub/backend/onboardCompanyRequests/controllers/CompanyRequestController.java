package com.azm.apihub.backend.onboardCompanyRequests.controllers;

import com.azm.apihub.backend.ApiHubUtils;
import com.azm.apihub.backend.entities.OnboardCompanyRequest;
import com.azm.apihub.backend.onboardCompanyRequests.models.CompanyRequestDTO;
import com.azm.apihub.backend.onboardCompanyRequests.services.CompanyRequestService;
import com.azm.apihub.backend.onboardCompanyRequests.validator.OnboardCompanyRequestValidator;
import io.swagger.v3.oas.annotations.Hidden;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/company-requests")
@Tag(name = "Company Request Management")
@AllArgsConstructor
@Slf4j
public class CompanyRequestController {

    @Autowired
    private CompanyRequestService companyRequestService;

    @Autowired
    private OnboardCompanyRequestValidator onboardCompanyRequestValidator;

    @GetMapping
    @Operation(summary = "This API is used to get all company requests")
    public ResponseEntity<List<OnboardCompanyRequest>> getAllCompanyRequests() {
        var startMillis = System.currentTimeMillis();
        UUID requestID = UUID.randomUUID();
        log.info("Request received for getting all company requests with requestId: {}", requestID);

        List<OnboardCompanyRequest> result = companyRequestService.getAllCompanyRequests();

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Get all company requests service took {} ms", timeTook);

        return new ResponseEntity<>(result, result.isEmpty() ? HttpStatus.NO_CONTENT : HttpStatus.OK);
    }

    @PostMapping
    @Operation(summary = "This API is used to create a new company request")
    public ResponseEntity<OnboardCompanyRequest> createCompanyRequest(@RequestBody @Validated CompanyRequestDTO companyRequestDTO,
                                                                      BindingResult bindingResult) {
        var startMillis = System.currentTimeMillis();
        log.info("Request received for creating a new company request");

        onboardCompanyRequestValidator.validate(companyRequestDTO, bindingResult);
        ApiHubUtils.checkRequestErrors(bindingResult);

        OnboardCompanyRequest createdRequest = companyRequestService.createCompanyRequest(companyRequestDTO);

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Create company service took {} ms", timeTook);

        return new ResponseEntity<>(createdRequest, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @Operation(summary = "This API is used to get a company request by ID")
    public ResponseEntity<OnboardCompanyRequest> getCompanyRequestDetails(@PathVariable Long id) {
        log.info("Request received for getting company request with ID: {}", id);
        OnboardCompanyRequest companyRequestDTO = companyRequestService.getCompanyRequestById(id);
        return ResponseEntity.ok(companyRequestDTO);
    }

    @GetMapping("registry-number/{number}")
    @Operation(summary = "This API is used to get a company request by Request number")
    public ResponseEntity<OnboardCompanyRequest> getCompanyRequestDetails(@PathVariable String number) {
        log.info("Request received for getting company request with RequestNumber: {}", number);
        OnboardCompanyRequest companyRequestDTO = companyRequestService.getCompanyRequestByRequestNumber(number);
        return ResponseEntity.ok(companyRequestDTO);
    }

    @PutMapping("/{id}")
    @Operation(summary = "This API is used to update a company request by ID")
    public ResponseEntity<OnboardCompanyRequest> updateCompanyRequest(@PathVariable Long id,
                                                                      @RequestBody @Validated CompanyRequestDTO companyRequestDTO,
                                                                      BindingResult bindingResult) {
        var startMillis = System.currentTimeMillis();
        log.info("Request received for updating company request with ID: {}", id);

        onboardCompanyRequestValidator.validate(companyRequestDTO, bindingResult);
        ApiHubUtils.checkRequestErrors(bindingResult);

        OnboardCompanyRequest updatedRequest = companyRequestService.updateCompanyRequest(id, companyRequestDTO);

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Update company service took {} ms", timeTook);

        return ResponseEntity.ok(updatedRequest);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "This API is used to delete a company request by ID")
    public ResponseEntity<Void> deleteCompanyRequest(@PathVariable Long id) {
        log.info("Request received for deleting company request with ID: {}", id);
        companyRequestService.deleteCompanyRequest(id);
        return ResponseEntity.noContent().build();
    }
}