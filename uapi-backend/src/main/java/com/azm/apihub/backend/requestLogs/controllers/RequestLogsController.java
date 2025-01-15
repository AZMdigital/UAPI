package com.azm.apihub.backend.requestLogs.controllers;

import com.azm.apihub.backend.ApiHubUtils;
import com.azm.apihub.backend.companies.services.CompanyService;
import com.azm.apihub.backend.entities.Company;
import com.azm.apihub.backend.entities.RequestLogs;
import com.azm.apihub.backend.entities.Service;
import com.azm.apihub.backend.entities.ServiceHead;
import com.azm.apihub.backend.requestLogs.models.RequestLogAddRequest;
import com.azm.apihub.backend.requestLogs.models.RequestLogUpdateRequest;
import com.azm.apihub.backend.requestLogs.services.RequestLogsService;
import com.azm.apihub.backend.requestLogs.validator.RequestLogValidator;
import com.azm.apihub.backend.services.services.ServiceHeadService;
import com.azm.apihub.backend.services.services.ServiceServices;
import io.swagger.v3.oas.annotations.Operation;
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
@AllArgsConstructor
@RequestMapping("/v1/request-log")
@Slf4j
public class RequestLogsController {

    @Autowired
    RequestLogsService requestLogsService;

    @Autowired
    private CompanyService companyService;

    @Autowired
    private ServiceServices servicesService;

    @Autowired
    private RequestLogValidator requestLogValidator;

    @PostMapping
    @Operation (
            summary = "This API is used to log request for the company."
    )
    public ResponseEntity<RequestLogs> addRequestLog(@RequestBody @Validated RequestLogAddRequest request,
                                                     BindingResult bindingResult) {

        var startMillis = System.currentTimeMillis();
        UUID requestId = UUID.randomUUID();
        log.info("Request received for logging request with requestId: {}", requestId);

        requestLogValidator.validate(request, bindingResult);
        ApiHubUtils.checkRequestErrors(bindingResult);

        Company company = companyService.getCompanyById(requestId, null, request.getCompanyId());

        Service service = servicesService.getServiceById(requestId, request.getServiceId());

        RequestLogs requestLogsResult = requestLogsService.addRequestLog(request.getRequestUuid(), company, service,
                request.getMethod(), request.getIsClientCredentialsUsed(), request.getIsMockup(), request.getIsPostpaid());

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Log request service took {} ms.", timeTook);

        return new ResponseEntity<>(requestLogsResult, HttpStatus.CREATED);
    }

    @PutMapping
    @Operation (
            summary = "This API is used to update log request for the company."
    )
    public ResponseEntity<RequestLogs> updateRequestLog(@RequestBody @Validated RequestLogUpdateRequest request) {

        var startMillis = System.currentTimeMillis();
        UUID requestId = UUID.randomUUID();
        log.info("Request received for update log request with requestId: {}", requestId);

        RequestLogs requestLogsResult = requestLogsService.updateRequestLog(request.getRequestUuid(), request);

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Update log request service took {} ms.", timeTook);

        return new ResponseEntity<>(requestLogsResult, HttpStatus.OK);
    }
}