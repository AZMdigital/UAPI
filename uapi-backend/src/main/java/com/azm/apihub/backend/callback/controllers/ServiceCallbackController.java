package com.azm.apihub.backend.callback.controllers;

import com.azm.apihub.backend.ApiHubUtils;
import com.azm.apihub.backend.callback.models.ServiceCallbackTransactionRequest;
import com.azm.apihub.backend.callback.services.ServiceCallbackService;
import com.azm.apihub.backend.callback.validator.ServiceCallbackRequestValidator;
import com.azm.apihub.backend.entities.ServiceCallback;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@RequestMapping("/v1/service-callback")
@Tag(name = "Service Callback Transaction Management")
@AllArgsConstructor
@Slf4j
public class ServiceCallbackController {

    @Autowired
    private final ServiceCallbackService serviceCallbackService;

    @Autowired
    private ServiceCallbackRequestValidator validator;

    @GetMapping(value = "/{transactionId}")
    @Operation(
            summary = "This Api is used to get callback transaction by transaction id"
    )

    public ResponseEntity<ServiceCallback> findCallbackTransactionById(@PathVariable String transactionId) {
        var startMillis = System.currentTimeMillis();
        UUID requestID = UUID.randomUUID();

        log.info("Request received for getting callback transaction by transactionId= "+transactionId+" with requestId:" + requestID);

        var result = serviceCallbackService.getServiceCallbackInfoTransactionId(transactionId);

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Get callback transaction by company id, service id and transaction id service took " + timeTook + " ms");

        return new ResponseEntity<>(result, HttpStatus.OK);

    }




















    @PostMapping
    @Operation (
            summary = "This API is used to add service callback transaction."
    )
    public ResponseEntity<ServiceCallback> addServiceCallbackTransaction(@RequestBody @Validated ServiceCallbackTransactionRequest request,
                                                                              BindingResult bindingResult) {

        var startMillis = System.currentTimeMillis();
        UUID requestId = UUID.randomUUID();
        log.info("Request received for adding service callback transaction with requestId: " + requestId);

        validator.validate(request, bindingResult);
        ApiHubUtils.checkRequestErrors(bindingResult);

        var result = serviceCallbackService.createCallbackEntry(request.getCompanyId(), request.getServiceId(), request.getTransactionId());

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Add service callback transaction service took " + timeTook + " ms.");

        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    @PutMapping
    @Operation (
            summary = "This API is used to update service callback transaction.",
            parameters = {
                    @Parameter(name = "transactionId", description = "Transaction id of callback")
            }
    )
    public ResponseEntity<ServiceCallback> updateServiceCallbackTransaction(@RequestParam(name = "transactionId") String transactionId) {

        var startMillis = System.currentTimeMillis();
        UUID requestId = UUID.randomUUID();
        log.info("Request received for updating service callback transaction with requestId: " + requestId);

        var result = serviceCallbackService.updateCallbackEntry(transactionId);

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Update service callback transaction service took " + timeTook + " ms.");

        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}
