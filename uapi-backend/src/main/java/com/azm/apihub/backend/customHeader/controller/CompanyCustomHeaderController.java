package com.azm.apihub.backend.customHeader.controller;

import com.azm.apihub.backend.configuration.rolesAndPermissions.RequiresPermission;
import com.azm.apihub.backend.customHeader.models.CompanyCustomHeaderRequest;
import com.azm.apihub.backend.customHeader.service.CompanyCustomHeaderService;
import com.azm.apihub.backend.entities.CompanyCustomHeader;
import com.azm.apihub.backend.entities.User;
import com.azm.apihub.backend.users.models.UserDetails;
import com.azm.apihub.backend.users.services.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/v1/custom-header")
@Slf4j
public class CompanyCustomHeaderController {

    @Autowired
    private CompanyCustomHeaderService service;

    @Autowired
    private UserService userService;

    @GetMapping("/company/{companyId}")
    public ResponseEntity<List<CompanyCustomHeader>> getAllByUserCompany(Authentication authentication, @PathVariable Long companyId) {
        var startMillis = System.currentTimeMillis();
        UUID requestId = UUID.randomUUID();
        log.info("Request received for getting company custom headers with requestId: {}", requestId);

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        if (!userDetails.isAdmin()) {
            User user = userService.getUserByUsername(userDetails.getUsername());
            companyId = user.getCompany().getId();
        }

        List<CompanyCustomHeader> companyCustomHeader = service.findAllByCompanyId(companyId);

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Getting company custom headers service took {} ms.", timeTook);

        return new ResponseEntity<>(companyCustomHeader, HttpStatus.OK);
    }

    @PostMapping
    @RequiresPermission("custom-headers-edit")
    public ResponseEntity<List<CompanyCustomHeader>> create(Authentication authentication, @RequestBody List<CompanyCustomHeaderRequest> request) {
        var startMillis = System.currentTimeMillis();
        UUID requestId = UUID.randomUUID();
        log.info("Request received for adding/updating company custom headers with requestId: {}", requestId);

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = userService.getUserByUsername(userDetails.getUsername());

        List<CompanyCustomHeader> savedCompanyCustomHeader = service.saveOrUpdateAll(request, user);

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Adding/Updating company custom headers service took {} ms.", timeTook);

        return new ResponseEntity<>(savedCompanyCustomHeader, HttpStatus.CREATED);
    }
}
