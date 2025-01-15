package com.azm.apihub.backend.permissions.controllers;

import com.azm.apihub.backend.companies.enums.AccountType;
import com.azm.apihub.backend.entities.Company;
import com.azm.apihub.backend.entities.Permission;
import com.azm.apihub.backend.permissions.services.PermissionService;
import com.azm.apihub.backend.users.models.UserDetails;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/permissions")
@Tag(name = "Roles Management")
@AllArgsConstructor
@Slf4j
public class PermissionController {

    @Autowired
    private PermissionService permissionService;

    @GetMapping
    @Operation(
            summary = "This Api is used to get all permission"
    )
    public ResponseEntity<List<Permission>> findAllPermissions(Authentication authentication) {
        var startMillis = System.currentTimeMillis();

        log.info("Request received for Getting all permissions");

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        Company company = userDetails.getCompany();
        var result = permissionService.getAllPermissions(company.getAccountType().equals(AccountType.SUB.name()));

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Get all permissions took " + timeTook + " ms");

        return new ResponseEntity<>(result, HttpStatus.OK);
    }

}
