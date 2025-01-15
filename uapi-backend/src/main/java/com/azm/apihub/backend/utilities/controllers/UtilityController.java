package com.azm.apihub.backend.utilities.controllers;

import com.azm.apihub.backend.ApiHubUtils;
import com.azm.apihub.backend.exceptions.BadRequestException;
import com.azm.apihub.backend.exceptions.UnAuthorizedException;
import com.azm.apihub.backend.utilities.models.GoogleSheetFillRequest;
import com.azm.apihub.backend.utilities.models.GoogleSheetRequest;
import com.azm.apihub.backend.utilities.services.UtilityService;
import com.azm.apihub.backend.utilities.validator.GoogleSheetFillRequestValidator;
import io.swagger.v3.oas.annotations.Hidden;
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
@Hidden
@RequestMapping("/v1/utility")
@AllArgsConstructor
@Slf4j
public class UtilityController {

    private final UtilityService utilityService;

    @Autowired
    private GoogleSheetFillRequestValidator googleSheetFillRequestValidator;

    @PostMapping("/processSheet")
    @Operation(
            summary = "Get excel sheet url to get deed numbers process those numbers to get deed info and store it in that sheet"
    )
    @Hidden
    public ResponseEntity<HttpStatus> processGoogleSheet(@RequestBody GoogleSheetRequest request,
                                                         @RequestHeader(name = "API-KEY") String  apiKey) {
        var startMillis = System.currentTimeMillis();
        UUID requestID = UUID.randomUUID();
        log.info("Request received for processing deed file with requestId:{}", requestID);

        if(apiKey == null)
            throw new UnAuthorizedException("Api key does not exist for this company");

        var sheetId = ApiHubUtils.extractSpreadsheetId(request.getSheetUrl());
        if(sheetId == null)
            throw new BadRequestException("Please provide correct google sheet url");

        utilityService.processSheet(sheetId, request.getProcessRows(), apiKey);

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Deed file processing Service took {} ms", timeTook);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/fillData")
    @Operation(
            summary = "Get excel sheet url to fill selected columns Data in the sheet"
    )
    @Hidden
    public ResponseEntity<HttpStatus> fillSheetData(@RequestBody @Validated GoogleSheetFillRequest request,
                                                    BindingResult bindingResult) {
        var startMillis = System.currentTimeMillis();
        UUID requestID = UUID.randomUUID();
        log.info("Request received for filling deed data in file with requestId:{}", requestID);

        googleSheetFillRequestValidator.validate(request, bindingResult);
        ApiHubUtils.checkRequestErrors(bindingResult);

        var sheetId = ApiHubUtils.extractSpreadsheetId(request.getSheetUrl());

        utilityService.fillSheetData(sheetId, request.getProcessRows(), request.getAccountId(), request.getSheetColumnAlphabet());

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Fill data in file Service took {} ms", timeTook);

        return new ResponseEntity<>(HttpStatus.OK);
    }
}
