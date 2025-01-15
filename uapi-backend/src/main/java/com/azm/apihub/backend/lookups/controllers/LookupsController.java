package com.azm.apihub.backend.lookups.controllers;

import com.azm.apihub.backend.entities.LookupType;
import com.azm.apihub.backend.entities.LookupValue;
import com.azm.apihub.backend.lookups.services.LookupTypeService;
import com.azm.apihub.backend.lookups.services.LookupValueService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/v1/lookups")
@Tag(name = "Lookups management")
@AllArgsConstructor
@Slf4j
public class LookupsController {

    private final LookupTypeService lookupTypeService;
    private final LookupValueService lookupValueService;


    @GetMapping
    @Operation(
            summary = "This Api is used to get all lookup types"
    )

    public ResponseEntity<List<LookupType>> findALlLookupTypes() {
        var startMillis = System.currentTimeMillis();
        UUID requestID = UUID.randomUUID();

        log.info("Request received for Getting all Lookup Types with requestId:" + requestID);

        var result = lookupTypeService.getAllLookupTypes(requestID);

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Get all lookup types took " + timeTook + " ms");

        return new ResponseEntity<>(result, HttpStatus.OK);

    }

    @GetMapping(value = "/{lookupTypeId}")
    @Operation(
            summary = "This Api is used to get lookup values by it's lookup type id"
    )

    public ResponseEntity<List<LookupValue>> getLookupValuesByTypeId(@PathVariable Long lookupTypeId) {
        var startMillis = System.currentTimeMillis();
        UUID requestID = UUID.randomUUID();
        log.info("Request received for getting the lookup value with lookupTypeId:"+lookupTypeId+", and request ID: "+requestID);

        var result = lookupValueService.getLookupValuesByTypeId(lookupTypeId);

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Get lookup values by id took " + timeTook + " ms");

        return new ResponseEntity<>(result, result.isEmpty() ? HttpStatus.NO_CONTENT : HttpStatus.OK);

    }

}
