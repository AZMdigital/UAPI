package com.azm.apihub.backend.integrationLogs.controllers;

import com.azm.apihub.backend.entities.integrationLogs.IntegrationRequestLogs;
import com.azm.apihub.backend.exceptions.BadRequestException;
import com.azm.apihub.backend.exceptions.ForbiddenException;
import com.azm.apihub.backend.integrationLogs.models.IntegrationRequestLogsResponse;
import com.azm.apihub.backend.integrationLogs.models.enums.RequestStatus;
import com.azm.apihub.backend.integrationLogs.services.IntegrationRequestLogsService;
import com.azm.apihub.backend.users.models.UserDetails;
import io.swagger.v3.oas.annotations.Operation;
import java.time.LocalDate;
import java.util.Date;
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
@RequestMapping("/v1/integration-request-logs")
@Slf4j
public class IntegrationRequestLogsController {

    @Autowired
    IntegrationRequestLogsService integrationRequestLogsService;

    @GetMapping(value = "/{companyId}")
    @Operation(
            summary = "This Api is used to get Api request log details of an account"
    )
    public ResponseEntity<IntegrationRequestLogsResponse> getRequestLogs(Authentication authentication,
                                                                                @PathVariable(name = "companyId") Long companyId,
                                                                                @RequestParam(name = "fromDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
                                                                                @RequestParam(name = "toDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
                                                                                @RequestParam(name = "serviceName", required = false) String serviceName,
                                                                                @RequestParam(name = "status", required = false) RequestStatus status,
                                                                                @RequestParam(defaultValue = "1") int pageNumber,
                                                                                @RequestParam(defaultValue = "10") int pageSize) {
        var startMillis = System.currentTimeMillis();

        UUID requestId = UUID.randomUUID();
        log.info("Request received for getting Api request log detail for accounts with request id:{}", requestId);

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        if(fromDate != null && toDate != null) {
            if(fromDate.isAfter(toDate))
                throw new BadRequestException("From date cannot be greater than To date ");
        }
        if (fromDate != null && fromDate.equals(toDate)) {
            log.info("Fetching logs for a single day: {}", fromDate);
        }
        if (fromDate != null && fromDate.equals(toDate)) {
            toDate = toDate.plusDays(1);
        }

        if(fromDate != null && toDate == null)
            throw new BadRequestException("To date is required");

        if(toDate != null && fromDate == null)
            throw new BadRequestException("From date is required");

        if(userDetails.isAdmin() || !Objects.equals(companyId, userDetails.getCompany().getId()))
            throw new ForbiddenException("You are only allowed to get request log details for your Account");

        IntegrationRequestLogsResponse result = integrationRequestLogsService.findLogsByAccount(requestId,
                userDetails.getCompany().getId(), serviceName, status, fromDate, toDate, pageNumber, pageSize);

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Request log detail for account service took {} ms", timeTook);

        return new ResponseEntity<>(result, result!= null ? HttpStatus.OK : HttpStatus.NO_CONTENT);
    }
}