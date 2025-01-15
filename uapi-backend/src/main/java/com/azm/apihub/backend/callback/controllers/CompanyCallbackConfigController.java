package com.azm.apihub.backend.callback.controllers;

import com.azm.apihub.backend.callback.models.CompanyCallbackConfigDTO;
import com.azm.apihub.backend.callback.models.CompanyCallbackConfigRequest;
import com.azm.apihub.backend.callback.services.CompanyCallbackConfigService;
import com.azm.apihub.backend.configuration.rolesAndPermissions.RequiresPermission;
import com.azm.apihub.backend.entities.Company;
import com.azm.apihub.backend.entities.User;
import com.azm.apihub.backend.exceptions.BadRequestException;
import com.azm.apihub.backend.users.models.UserDetails;
import com.azm.apihub.backend.users.services.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;
import java.util.Objects;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/v1/callback-config")
@Tag(name = "Callback Url Configuration")
@AllArgsConstructor
@Slf4j
public class CompanyCallbackConfigController {

    @Autowired
    private final CompanyCallbackConfigService companyCallbackConfigService;

    @Autowired
    private UserService userService;

    @GetMapping(value = "/account/{companyId}/service/{serviceId}")
    @Operation(
            summary = "This Api is used to get callback info by company id and service id"
    )

    public ResponseEntity<CompanyCallbackConfigDTO> findCallbackInfoById(@PathVariable Long companyId, @PathVariable Long serviceId) {
        var startMillis = System.currentTimeMillis();
        UUID requestID = UUID.randomUUID();

        log.info("Request received for getting callback info by companyId= "+companyId+" and serviceId= "+serviceId+" with requestId:" + requestID +" and companyId = "+companyId);

        var result = companyCallbackConfigService.getCallbackUrlByCompanyIdAndServiceId(requestID, companyId, serviceId);

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Get callback info by company id and service id service took " + timeTook + " ms");

        return new ResponseEntity<>(result, HttpStatus.OK);

    }

    @PostMapping(value = "/account")
    @Operation(
            summary = "This Api is used to add company callback config"
    )
    @RequiresPermission({"company-callback-config-edit"})
    public ResponseEntity<CompanyCallbackConfigDTO> addCompanyCallbackConfig(Authentication authentication,
                                                                             @RequestBody CompanyCallbackConfigRequest companyCallbackConfigRequest) {
        var startMillis = System.currentTimeMillis();
        UUID requestID = UUID.randomUUID();

        log.info("Request received for add company callback config with Request Id {}", requestID);

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        Company company = null;
        if(!userDetails.isAdmin()) {
            User user = userService.getUserByUsername(userDetails.getUsername());
            company = user.getCompany();
        } else if (Objects.isNull(companyCallbackConfigRequest.getCompanyId()) || companyCallbackConfigRequest.getCompanyId() == 0)
            throw new BadRequestException("Company Id does not exists");

        var result = companyCallbackConfigService.addCompanyCallbackConfig(company, companyCallbackConfigRequest, userDetails.getUsername(), userDetails.isAdmin());

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Add company callback config service took {} ms", timeTook);

        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @PutMapping(value = "/account/{id}")
    @Operation(
            summary = "This Api is used to update company callback config",
            parameters = {
                    @Parameter(name = "id", description = "The id of the company callback config"),
            }
    )
    @RequiresPermission({"company-callback-config-edit"})
    public ResponseEntity<CompanyCallbackConfigDTO> updateCompanyCallbackConfig(Authentication authentication, @PathVariable Long id,
                                                                                @RequestBody CompanyCallbackConfigRequest companyCallbackConfigRequest) {
        var startMillis = System.currentTimeMillis();
        UUID requestID = UUID.randomUUID();

        log.info("Request received for update company callback config with Request Id {}", requestID);

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        Company company = null;
        if(!userDetails.isAdmin()) {
            User user = userService.getUserByUsername(userDetails.getUsername());
            company = user.getCompany();
        } else if (Objects.isNull(companyCallbackConfigRequest.getCompanyId()) || companyCallbackConfigRequest.getCompanyId() == 0)
            throw new BadRequestException("Company Id does not exists");

        var result = companyCallbackConfigService.updateCompanyCallbackConfig(id, company, companyCallbackConfigRequest,
                userDetails.getUsername(), userDetails.isAdmin(), userDetails.isAccountSuperAdmin());

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Update company callback config service took {} ms", timeTook);

        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping(value = "/account")
    @Operation(
            summary = "This Api is used to get callback info by company"
    )
    public ResponseEntity<List<CompanyCallbackConfigDTO>> findCallbackInfo(Authentication authentication,
                                                                                    @RequestParam(name = "companyId", required = false) Long companyId) {
        var startMillis = System.currentTimeMillis();
        UUID requestID = UUID.randomUUID();

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        List<CompanyCallbackConfigDTO> result;

        if(!userDetails.isAdmin()) {
            User user = userService.getUserByUsername(userDetails.getUsername());
            companyId = user.getCompany().getId();
        }

        if(Objects.nonNull(companyId)) {
            log.info("Request received for getting callback info by companyId= {} with requestId:{}", companyId, requestID);
            result = companyCallbackConfigService.findCallbackInfoByCompany(companyId);
        } else {
            log.info("Request received for getting callback info with requestId: {}", requestID);
            result = companyCallbackConfigService.findAll();
        }

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Get callback info took {} ms", timeTook);

        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @DeleteMapping(value = "/account/{id}")
    @Operation(
            summary = "This Api is used to delete company callback config",
            parameters = {
                    @Parameter(name = "id", description = "The id of the company callback config"),
            }
    )
    @RequiresPermission({"company-callback-config-edit"})
    public ResponseEntity<Void> deleteCompanyCallbackConfig(Authentication authentication, @PathVariable Long id) {
        var startMillis = System.currentTimeMillis();
        UUID requestID = UUID.randomUUID();

        log.info("Request received for delete company callback config with Request Id {}", requestID);

        Long companyId = null;
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        if(!userDetails.isAdmin()) {
            User user = userService.getUserByUsername(userDetails.getUsername());
            companyId = user.getCompany().getId();
        }

        companyCallbackConfigService.deleteCompanyCallbackConfig(id, companyId, userDetails.getUsername(),
                userDetails.isAdmin(), userDetails.isAccountSuperAdmin());

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Delete company callback config service took {} ms", timeTook);

        return new ResponseEntity<>(HttpStatus.OK);
    }
}