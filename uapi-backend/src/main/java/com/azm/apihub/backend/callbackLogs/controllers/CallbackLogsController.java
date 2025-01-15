package com.azm.apihub.backend.callbackLogs.controllers;

import com.azm.apihub.backend.callbackLogs.models.CallbackLogsResponse;
import com.azm.apihub.backend.callbackLogs.services.CallbackLogsService;
import com.azm.apihub.backend.exceptions.BadRequestException;
import com.azm.apihub.backend.exceptions.ForbiddenException;
import com.azm.apihub.backend.users.models.UserDetails;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Objects;
import java.util.UUID;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/v1/callback-logs")
public class CallbackLogsController {

    @Autowired
    private CallbackLogsService callbackLogsService;

    @GetMapping
    @Operation(summary = "Retrieve all callback logs")
    public ResponseEntity<CallbackLogsResponse> getAllLogs(Authentication authentication,
                                                           @RequestParam(name = "fromDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
                                                           @RequestParam(name = "toDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
                                                           @RequestParam(name = "serviceId", required = false) Long serviceId,
                                                           @RequestParam(name = "companyId", required = false) Long companyId,
                                                           @RequestParam(required = false, defaultValue = "true") Boolean applyPagination,
                                                           @RequestParam(defaultValue = "1") int pageNumber,
                                                           @RequestParam(defaultValue = "10") int pageSize) {

        var startMillis = System.currentTimeMillis();

        UUID requestId = UUID.randomUUID();
        log.info("Request received for getting Callback logs with request id:{}", requestId);

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        if(fromDate != null && toDate != null) {
            if(fromDate.isAfter(toDate))
                throw new BadRequestException("From date cannot be greater than To date ");
        }

        if(fromDate != null && toDate == null)
            throw new BadRequestException("To date is required");

        if(toDate != null && fromDate == null)
            throw new BadRequestException("From date is required");


        if(!userDetails.isAdmin() && !Objects.equals(companyId, userDetails.getCompany().getId()))
            throw new ForbiddenException("You are only allowed to get request log details for your Account");

        CallbackLogsResponse result = null;
        if(userDetails.isAdmin()) {
            result = callbackLogsService.findAllLogs(serviceId, companyId,  fromDate, toDate, pageNumber, pageSize, applyPagination);
        } else {
            result = callbackLogsService.findAllLogs(serviceId, userDetails.getCompany().getId(), fromDate, toDate, pageNumber, pageSize, applyPagination);
        }

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Request callback log service took {} ms", timeTook);

        return new ResponseEntity<>(result, result != null ? HttpStatus.OK : HttpStatus.NO_CONTENT);
    }

}

