package com.azm.apihub.integrations.mock.controllers;

import com.azm.apihub.integrations.mock.services.MockService;
import com.azm.apihub.integrations.utils.IntegrationConstants;
import com.azm.apihub.integrations.wathq.attorney.models.Control;
import com.azm.apihub.integrations.wathq.attorney.models.InfoSuccessResponse;
import com.azm.apihub.integrations.wathq.attorney.services.WathqAttorneyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/v1/mock")
@Tag(name = IntegrationConstants.WATHQ_ATTORNEY_SERVICE)
@AllArgsConstructor
@Slf4j
public class MockController {

    private final MockService mockService;


    @GetMapping(produces="application/json")
    @Operation(
            summary = "Mock Service"
    )

    public ResponseEntity<String> getMockData(@RequestParam(name = "serviceHandle") String serviceHandle,
                                              @RequestParam(name = "serviceId") Long serviceId) {
        var startMillis = System.currentTimeMillis();
        UUID requestID = UUID.randomUUID();
        log.info("Request receive for mock data for service: "+serviceHandle+" with request ID: "+requestID);

        var result = mockService.getMockServiceData(serviceHandle, serviceId);

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Mock Service took " + timeTook + " ms");

        return new ResponseEntity<>(result, HttpStatus.OK);

    }
}
