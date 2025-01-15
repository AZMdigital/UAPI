package com.azm.apihub.backend.audit.controllers;

import com.azm.apihub.backend.audit.models.ApiHubUsernames;
import com.azm.apihub.backend.audit.models.AuditLogsResponse;
import com.azm.apihub.backend.audit.services.AuditLogsService;
import com.azm.apihub.backend.entities.ApiHubModules;
import com.azm.apihub.backend.exceptions.BadRequestException;
import com.azm.apihub.backend.exceptions.ForbiddenException;
import com.azm.apihub.backend.users.models.UserDetails;
import io.swagger.v3.oas.annotations.Operation;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping("/v1/audit-logs")
@Slf4j
public class AuditLogsController {

    @Autowired
    AuditLogsService auditLogsService;

    @GetMapping(value = "")
    @Operation(
            summary = "This Api is used to get Api request log details of an account"
    )
    public ResponseEntity<AuditLogsResponse> getAuditLogs(Authentication authentication,
                                                          @RequestParam(name = "moduleName", required = false) String moduleName,
                                                          @RequestParam(name = "companyId", required = false) Long companyId,
                                                          @RequestParam(name = "updatedByUsername", required = false) String updatedByUsername,
                                                          @RequestParam(name = "action", required = false) String action,
                                                          @RequestParam(name = "fromDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
                                                          @RequestParam(name = "toDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
                                                          @RequestParam(defaultValue = "1") int pageNumber,
                                                          @RequestParam(defaultValue = "10") int pageSize,
                                                          @RequestParam(required = false, defaultValue = "true") Boolean applyPagination) {
        var startMillis = System.currentTimeMillis();

        UUID requestId = UUID.randomUUID();
        log.info("Request received for getting Audit logs with request id:{}", requestId);

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

        AuditLogsResponse result = null;
        if(userDetails.isAdmin()) {
            result = auditLogsService.getAuditLogs(companyId, updatedByUsername, moduleName, action, fromDate, toDate, pageNumber, pageSize, applyPagination);
        } else {
            result = auditLogsService.getAuditLogs(userDetails.getCompany().getId(), updatedByUsername, moduleName, action, fromDate, toDate, pageNumber, pageSize, applyPagination);
        }

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Request audit log service took {} ms", timeTook);

        return new ResponseEntity<>(result, result != null ? HttpStatus.OK : HttpStatus.NO_CONTENT);
    }

    @GetMapping(value = "/modules")
    @Operation(
            summary = "This Api is used to get Api request log details of an account"
    )
    public ResponseEntity<List<ApiHubModules>> getModules() {
        var startMillis = System.currentTimeMillis();

        UUID requestId = UUID.randomUUID();
        log.info("Request received for getting all modules with request id:{}", requestId);

        var result = auditLogsService.getAllModules();

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Request to get all modules service took {} ms", timeTook);

        return new ResponseEntity<>(result, HttpStatus.OK );
    }

    @GetMapping(value = "/usernames")
    @Operation(
            summary = "This Api is used to get Api request log details of an account"
    )
    public ResponseEntity<List<ApiHubUsernames>> getAllUsernames(Authentication authentication) {
        var startMillis = System.currentTimeMillis();

        UUID requestId = UUID.randomUUID();
        log.info("Request received for getting all usernames with request id:{}", requestId);

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        var result = auditLogsService.getAllUsernames(userDetails.isAdmin() ? null : userDetails.getCompany().getId());

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Request to get all usernames service took {} ms", timeTook);

        return new ResponseEntity<>(result, HttpStatus.OK );
    }
}