package com.azm.apihub.backend.notifications.controllers;

import com.azm.apihub.backend.notifications.services.ConsumptionUsageService;
import io.swagger.v3.oas.annotations.Hidden;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/v1/consumption-usage")
@Tag(name = "Consumption usage alert system")
@AllArgsConstructor
@Slf4j
public class ConsumptionUsageController {

    @Autowired
    private final ConsumptionUsageService consumptionUsageService;

    @GetMapping(value = "/alert/{companyId}")
    @Operation(
            summary = "This Api is used to send consumption alert to account's user"
    )
    @Hidden
    public ResponseEntity<HttpStatus> sendConsumptionAlert(@PathVariable(name = "companyId") Long companyId,
                                                           @RequestParam(name = "packageType") String packageType,
                                                           @RequestParam(name = "consumptionPercentage") Double consumptionPercentage,
                                                           @RequestParam(name = "companyPackageSelectedId") Long companyPackageSelectedId) {
        var startMillis = System.currentTimeMillis();
        UUID requestID = UUID.randomUUID();

        log.info("Request received for sending consumption alert with requestId:{}", requestID);

        consumptionUsageService.sendConsumptionUsageNotification(companyId, packageType, consumptionPercentage, companyPackageSelectedId);

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Send consumption alert service took {} ms", timeTook);

        return new ResponseEntity<>(HttpStatus.OK);

    }
}
