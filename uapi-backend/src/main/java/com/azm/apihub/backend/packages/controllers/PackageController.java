package com.azm.apihub.backend.packages.controllers;

import com.azm.apihub.backend.ApiHubUtils;
import com.azm.apihub.backend.entities.Package;
import com.azm.apihub.backend.entities.PackageType;
import com.azm.apihub.backend.exceptions.ForbiddenException;
import com.azm.apihub.backend.packages.models.CreatePackageRequest;
import com.azm.apihub.backend.packages.models.UpdatePackageRequest;
import com.azm.apihub.backend.packages.services.PackageService;
import com.azm.apihub.backend.packages.validator.PackageRequestValidator;
import com.azm.apihub.backend.packages.validator.PackageUpdateRequestValidator;
import com.azm.apihub.backend.users.models.UserDetails;
import io.swagger.v3.oas.annotations.Hidden;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/packages")
@Tag(name = "Package Management")
@AllArgsConstructor
@Slf4j
public class PackageController {

    @Autowired
    private PackageService packageService;

    @Autowired
    private PackageRequestValidator packageRequestValidator;

    @Autowired
    PackageUpdateRequestValidator packageUpdateRequestValidator;

    @PostMapping
    @Operation(
            summary = "This Api is used to create a package",
            parameters = {
                    @Parameter(name = "createPackageRequest", description = "The json body of package request"),
            }
    )
    public ResponseEntity<Package> createPackage(@RequestBody @Validated CreatePackageRequest createPackageRequest,
                                                 BindingResult bindingResult,
                                                 Authentication authentication) {

        var startMillis = System.currentTimeMillis();

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        UUID requestId = UUID.randomUUID();
        log.info("Request received for creating package with requestId:{}", requestId);

        if(userDetails.isSubAccount() && userDetails.getCompany().getUseMainAccountBundles()) {
            throw new ForbiddenException("You are not allowed to create package");
        }

        packageRequestValidator.validate(createPackageRequest, bindingResult);
        ApiHubUtils.checkRequestErrors(bindingResult);

        var result = packageService.createPackage(createPackageRequest, userDetails);

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Create package service took {} ms", timeTook);

        return new ResponseEntity<>(result, HttpStatus.CREATED);

    }

    @PutMapping(value = "/{id}")
    @Operation(
            summary = "This Api is used to update a package",
            parameters = {
                    @Parameter(name = "updatePackageRequest", description = "The json body of package update request"),
            }
    )
    public ResponseEntity<Package> updatePackage(@PathVariable Long id,
                                                 @RequestBody @Validated UpdatePackageRequest updatePackageRequest,
                                                 BindingResult bindingResult,
                                                 Authentication authentication) {

        var startMillis = System.currentTimeMillis();

        UUID requestId = UUID.randomUUID();
        log.info("Request received for updating package with requestId:{}", requestId);

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        if(userDetails.isSubAccount() && userDetails.getCompany().getUseMainAccountBundles()) {
            throw new ForbiddenException("You are not allowed to update package");
        }

        packageUpdateRequestValidator.validate(updatePackageRequest, bindingResult);
        ApiHubUtils.checkRequestErrors(bindingResult);

        var result = packageService.updatePackage(id, updatePackageRequest);

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Update package service took {} ms", timeTook);

        return new ResponseEntity<>(result, HttpStatus.OK);

    }

    @GetMapping
    @Operation(
            summary = "This Api is used to get all Packages",
            parameters = {
                    @Parameter(name = "packageType", description = "Input package type (ANNUAL or SERVICES)"),
            }
    )
    public ResponseEntity<List<Package>> getAllPackages(@RequestParam(name = "packageType") PackageType packageType) {

        var startMillis = System.currentTimeMillis();

        UUID requestId = UUID.randomUUID();
        log.info("Request received for getting all packages for packageType= {} with requestId:{}", packageType.name(), requestId);

        var result = packageService.getPackages(packageType);

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Get packages service took {} ms", timeTook);

        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @DeleteMapping(value = "/{id}")
    @Operation(
            summary = "This Api is used to delete a package",
            parameters = {
                    @Parameter(name = "packageId", description = "The id of package to delete"),
            }
    )
    public ResponseEntity<Void> deletePackage(@PathVariable Long id) {

        var startMillis = System.currentTimeMillis();

        UUID requestId = UUID.randomUUID();
        log.info("Request received for deleting package with id " + id + ", request id" + requestId);

        packageService.deletePackage(id);

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Delete package service took " + timeTook + " ms");

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping(value = "/integration/{id}")
    @Operation(
            summary = "This Api is used to update a package",
            parameters = {
                    @Parameter(name = "updatePackageRequest", description = "The json body of package update request"),
            }
    )
    @Hidden
    public ResponseEntity<Package> updatePackageFromIntegration(@PathVariable Long id,
                                                                @RequestBody @Validated UpdatePackageRequest updatePackageRequest,
                                                                BindingResult bindingResult) {

        var startMillis = System.currentTimeMillis();

        UUID requestId = UUID.randomUUID();
        log.info("Request received for updating package from integration with requestId:" + requestId);

        packageRequestValidator.validate(updatePackageRequest, bindingResult);
        ApiHubUtils.checkRequestErrors(bindingResult);

        var result = packageService.updatePackage(id, updatePackageRequest);

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Update package from integration service took " + timeTook + " ms");

        return new ResponseEntity<>(result, HttpStatus.OK);

    }
}
