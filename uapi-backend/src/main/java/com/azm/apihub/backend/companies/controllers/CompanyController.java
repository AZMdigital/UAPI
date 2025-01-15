package com.azm.apihub.backend.companies.controllers;

import com.azm.apihub.backend.ApiHubUtils;
import com.azm.apihub.backend.companies.models.*;
import com.azm.apihub.backend.companies.services.CompanyService;
import com.azm.apihub.backend.companies.validator.CompanyPackageRequestValidator;
import com.azm.apihub.backend.companies.validator.CompanyRequestValidator;
import com.azm.apihub.backend.configuration.rolesAndPermissions.RequiresPermission;
import com.azm.apihub.backend.entities.AccountServiceHeadSubscription;
import com.azm.apihub.backend.entities.ApiKey;
import com.azm.apihub.backend.entities.Company;
import com.azm.apihub.backend.entities.CompanyPackageAllowed;
import com.azm.apihub.backend.entities.CompanyPackageSelected;
import com.azm.apihub.backend.entities.Package;
import com.azm.apihub.backend.entities.PackageStatus;
import com.azm.apihub.backend.entities.PackageType;
import com.azm.apihub.backend.exceptions.BadRequestException;
import com.azm.apihub.backend.exceptions.ForbiddenException;
import com.azm.apihub.backend.users.models.UserDetails;
import com.azm.apihub.backend.users.models.UserResponse;
import com.azm.apihub.backend.users.services.UserService;
import io.swagger.v3.oas.annotations.Hidden;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/companies")
@Tag(name = "Company Management")
@AllArgsConstructor
@Slf4j
public class CompanyController {

    @Autowired
    private CompanyService companyService;

    @Autowired
    private UserService userService;

    @Autowired
    private CompanyRequestValidator companyRequestValidator;

    @Autowired
    private CompanyPackageRequestValidator companyPackageRequestValidator;

    private final String API_KEY_NOT_GENERATED_MESSAGE = "Api key is not generated yet. Please use post endpoint to generate api key";

    @GetMapping
    @Operation(
            summary = "This Api is used to get all list of companies"
    )

    public ResponseEntity<CompanyResponse> findCompanies(@RequestParam(required = false) String query,
                                                         @RequestParam(required = false) String accountType) {
        var startMillis = System.currentTimeMillis();
        UUID requestID = UUID.randomUUID();
        log.info("Request received for Getting all Companies with requestId:"+requestID);

        var result = companyService.getCompanies(requestID, null, query, accountType);

        CompanyResponse companyResponse = new CompanyResponse(true, "", result);

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Get all companies service took " + timeTook + " ms");

        return new ResponseEntity<>(companyResponse, result != null ? HttpStatus.OK: HttpStatus.NO_CONTENT);

    }

    @GetMapping(value = "/{companyId}/sub-account")
    @Operation(
            summary = "This Api is used to get all list of sub accounts of the company"
    )
    public ResponseEntity<CompanyResponse> findAllSubAccounts(Authentication authentication,
                                                              @PathVariable Long companyId,
                                                              @RequestParam(required = false) String query) {
        var startMillis = System.currentTimeMillis();
        UUID requestID = UUID.randomUUID();
        log.info("Request received for Getting all sub accounts for company {} with requestId:{}", companyId, requestID);

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        if(!userDetails.isAdmin()) {
            if (!Objects.equals(userDetails.getCompany().getId(), companyId))
                throw new ForbiddenException("You are not authorized to get sub accounts for this company");

            if (userDetails.isSubAccount())
                throw new ForbiddenException("Only main account can get list of sub accounts");
        }

        var result = companyService.getCompanies(requestID, companyId, query, null);

        CompanyResponse companyResponse = new CompanyResponse(true, "", result);

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Getting all sub accounts service took {} ms", timeTook);

        return new ResponseEntity<>(companyResponse, result != null ? HttpStatus.OK: HttpStatus.NO_CONTENT);

    }

    @GetMapping(value = "/{id}")
    @Operation(
            summary = "This Api is used to get company by id",
            parameters = {
                    @Parameter(name = "id", description = "The ID of the company"),
            }
    )

    public ResponseEntity<Company> findCompanyById(
            @PathVariable(name = "id", required = true) Long id

    ) {
        var startMillis = System.currentTimeMillis();
        UUID requestID = UUID.randomUUID();
        log.info("Request received for Getting company by ID: {} with requestId:{}", id, requestID);

        var result = companyService.getCompanyById(requestID, null, id);

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Get company by id service took {} ms", timeTook);

        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping(value = "/{companyId}/sub-account/{subAccountId}")
    @Operation(
            summary = "This Api is used to get sub account by id",
            parameters = {
                    @Parameter(name = "companyId", description = "The ID of the company"),
                    @Parameter(name = "id", description = "The ID of the sub account")
            }
    )
    public ResponseEntity<Company> findSubAccountById(Authentication authentication,
                                                      @PathVariable(name = "companyId") Long companyId,
                                                      @PathVariable(name = "subAccountId") Long subAccountId

    ) {
        var startMillis = System.currentTimeMillis();
        UUID requestID = UUID.randomUUID();
        log.info("Request received for Getting sub account by ID: {} with requestId:{}", subAccountId, requestID);

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        if(!userDetails.isAdmin()) {
            if (!Objects.equals(userDetails.getCompany().getId(), companyId))
                throw new ForbiddenException("You are not authorized to get sub account details for this company");
        }
        var result = companyService.getCompanyById(requestID, companyId, subAccountId);

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Get sub account by id service took {} ms", timeTook);

        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @PostMapping
    @Operation(
            summary = "This Api is used to create a company",
            parameters = {
                    @Parameter(name = "companyRequest", description = "The json body of company request"),
            }
    )

    public ResponseEntity<Company> createCompany(@RequestBody @Validated CompanyRequest companyRequest, BindingResult bindingResult) {

        var startMillis = System.currentTimeMillis();
        UUID requestId = UUID.randomUUID();
        log.info("Request received for creating company with requestId:{}", requestId);

        companyRequestValidator.validate(companyRequest, bindingResult);
        ApiHubUtils.checkRequestErrors(bindingResult);

        var result = companyService.createCompanyWithAttachmentIds(requestId, null, companyRequest);

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Create company service took " + timeTook + " ms");

        return new ResponseEntity<>(result, HttpStatus.CREATED);

    }

    @PostMapping(value = "/{companyId}/sub-account")
    @Operation(
            summary = "This Api is used to create a sub account",
            parameters = {
                    @Parameter(name = "companyId", description = "The id of the company"),
                    @Parameter(name = "companyRequest", description = "The json body of sub account request"),
            }
    )
    @RequiresPermission({"sub-account-add"})
    public ResponseEntity<Company> createSubAccount(Authentication authentication,
                                                    @PathVariable Long companyId,
                                                    @RequestBody SubAccountRequest subAccountRequest) {

        var startMillis = System.currentTimeMillis();
        UUID requestId = UUID.randomUUID();
        log.info("Request received for creating sub account with requestId:{}", requestId);

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        if(!Objects.equals(userDetails.getCompany().getId(), companyId))
            throw new ForbiddenException("You are not authorized to add sub account to this company");

        if(userDetails.isSubAccount())
            throw new ForbiddenException("Only main account can add sub accounts");

        var result = companyService.createSubAccount(requestId, userDetails.getCompany().getId(), subAccountRequest);

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Create sub account service took {} ms", timeTook);

        return new ResponseEntity<>(result, HttpStatus.CREATED);

    }

    @PutMapping(value = "/{id}")
    @Operation(
            summary = "This Api is used to update a company by id",
            parameters = {
                    @Parameter(name = "id", description = "The id of the company"),
                    @Parameter(name = "companyRequest", description = "The json body of company request"),
            }
    )

    public ResponseEntity<Company> updateCompany(Authentication authentication,
                                                 @PathVariable Long id,
                                                 @RequestBody @Validated CompanyUpdateRequest companyRequest,
                                                 BindingResult bindingResult) {
        var startMillis = System.currentTimeMillis();
        UUID requestID = UUID.randomUUID();
        log.info("Request received for updating company by ID: {} with requestId:{}", id, requestID);

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        if(!userDetails.isAdmin() && !Objects.equals(userDetails.getCompany().getId(), id))
            throw new ForbiddenException("You can only update your own company details");

        companyRequestValidator.validate(companyRequest, bindingResult);
        ApiHubUtils.checkRequestErrors(bindingResult);

        var result = companyService.updateCompanyWithAttachmentIds(requestID, null, id, companyRequest);

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Updating company service took {} ms", timeTook);

        return new ResponseEntity<>(result, HttpStatus.OK);

    }

    @PutMapping(value = "/{companyId}/sub-account/{subAccountId}")
    @Operation(
            summary = "This Api is used to update a sub account by id",
            parameters = {
                    @Parameter(name = "companyId", description = "The id of the company"),
                    @Parameter(name = "subAccountId", description = "The id of the sub account"),
                    @Parameter(name = "companyRequest", description = "The json body of company request"),
            }
    )
    @RequiresPermission({"sub-account-edit"})
    public ResponseEntity<Company> updateSubAccount(Authentication authentication,
                                                    @PathVariable Long companyId,
                                                    @PathVariable Long subAccountId,
                                                    @RequestBody SubAccountRequest companyRequest) {
        var startMillis = System.currentTimeMillis();
        UUID requestID = UUID.randomUUID();
        log.info("Request received for updating sub account by ID: {} with requestId:{}", subAccountId, requestID);

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        if(userDetails.getCompany() != null) {
            if ((userDetails.isSubAccount() && !Objects.equals(userDetails.getCompany().getId(), subAccountId))
                    || !Objects.equals(userDetails.getCompany().getId(), companyId))
                throw new ForbiddenException("You can only update your own company details");
        } else
            throw new ForbiddenException("You can only update your own company details");


        var result = companyService.updateSubAccount(requestID, companyId, subAccountId, companyRequest);

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Updating sub account service took {} ms", timeTook);

        return new ResponseEntity<>(result, HttpStatus.OK);

    }

    @PostMapping(value = "/{id}/subscribe_services_postpaid")
    @Operation(
            summary = "This Api is used to subscribe postpaid services package for a company by id",
            parameters = {
                    @Parameter(name = "id", description = "The id of the company"),
            }
    )
    @RequiresPermission({"package-add"})
    public ResponseEntity<Company> subscribeServicesPackage(@PathVariable Long id, Authentication authentication) {

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        Company company = userService.getUserByUsername(userDetails.getUsername()).getCompany();

        if(id.compareTo(company.getId()) != 0) {
            throw new BadRequestException("Customer can only call this for its own company");
        }

        if(Boolean.FALSE.equals(company.getAllowPostpaidPackages())) {
            throw new BadRequestException("Customer is not allowed to subscribe to postpaid services bundle");
        }

        if(Boolean.TRUE.equals(company.getServicesPostpaidSubscribed())) {
            throw new BadRequestException("Customer is already subscribed to services postpaid package");
        }

        var result = companyService.subscribePostpaidBundle(id);

        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @DeleteMapping(value = "/{id}")
    @Operation(
            summary = "This Api is used to delete a company by id",
            parameters = {
                    @Parameter(name = "id", description = "The id of the company"),
            }
    )

    public ResponseEntity<HttpStatus> deleteCompany(@PathVariable Long id) {
        var startMillis = System.currentTimeMillis();
        UUID requestID = UUID.randomUUID();
        log.info("Request received for deleting company by ID: {} with requestId:{}", id, requestID);

        companyService.deleteCompany(requestID, null, id);

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Deleting company service took {} ms", timeTook);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping(value = "/{companyId}/sub-account/{subAccountId}")
    @Operation(
            summary = "This Api is used to delete a sub account by id",
            parameters = {
                    @Parameter(name = "companyId", description = "The id of the main account"),
                    @Parameter(name = "subAccountId", description = "The id of the sub account"),
            }
    )
    @RequiresPermission({"sub-account-delete"})
    public ResponseEntity<HttpStatus> deleteSubAccount(Authentication authentication,
                                                       @PathVariable Long companyId,
                                                       @PathVariable Long subAccountId) {
        var startMillis = System.currentTimeMillis();
        UUID requestID = UUID.randomUUID();
        log.info("Request received for deleting sub account by ID: {} with requestId:{}", subAccountId, requestID);

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        if(!Objects.equals(userDetails.getCompany().getId(), companyId))
            throw new ForbiddenException("You are not authorized to delete this sub account");

        if(userDetails.isSubAccount())
            throw new ForbiddenException("Only main account can delete sub accounts");

        companyService.deleteCompany(requestID, companyId, subAccountId);

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Deleting sub account service took {} ms", timeTook);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/api-key")
    @Operation(
            summary = "This Api is used to create api token for company"
    )
    @RequiresPermission({"apikey-edit"})
    public ResponseEntity<ApiKey> createCompanyApiKey(Authentication authentication) {
        var startMillis = System.currentTimeMillis();
        UUID requestID = UUID.randomUUID();
        log.info("Request received for creating Apikey for company with requestId:"+requestID);

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        Company company = userService.getUserByUsername(userDetails.getUsername()).getCompany();

        Optional<ApiKey> apiKey = companyService.findApiKey(requestID, company.getId());

        if(apiKey.isPresent()) {
            companyService.deleteApiKey(requestID, company.getId());
        }

        var result = companyService.createAPIKey(requestID, company);

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Create company service took " + timeTook + " ms");

        return new ResponseEntity<>(result, HttpStatus.CREATED);

    }

    @GetMapping("/api-key")
    @Operation(
            summary = "This Api is used to get api token for company"
    )
    public ResponseEntity<ApiKeyResponse> getCompanyApiKey(Authentication authentication) {
        var startMillis = System.currentTimeMillis();
        UUID requestID = UUID.randomUUID();
        log.info("Request received for getting Apikey for company with requestId:"+requestID);

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        Company company = userService.getUserByUsername(userDetails.getUsername()).getCompany();

        Optional<ApiKey> apiKey = companyService.findApiKey(requestID, company.getId());
        ApiKeyResponse response = new ApiKeyResponse();

        if(apiKey.isPresent()) {
            response.setApiKey(apiKey.get());
        } else {
            response.setMessage(API_KEY_NOT_GENERATED_MESSAGE);
        }

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Create company service took " + timeTook + " ms");

        return new ResponseEntity<>(response, HttpStatus.OK);

    }

    @GetMapping("/api-key/validate")
    @Operation(
            summary = "This Api is used validate api-key. It returns company if validation is successful otherwise returns 401.",
            parameters = {
                    @Parameter(name = "api-key", description = "The ApiKey of the company")
            }
    )
    public ResponseEntity<Company> validateCompanyApiKey(@RequestHeader(name = "api-key") String apiKey) {
        var startMillis = System.currentTimeMillis();
        UUID requestID = UUID.randomUUID();
        log.info("Request received for validating Apikey with requestId:"+requestID);

        ApiKey apiKeyResponse = companyService.findByApiKeyAndAccountKey(requestID, apiKey);

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Validate token service took " + timeTook + " ms");

        return new ResponseEntity<>(apiKeyResponse.getCompany(), HttpStatus.OK);

    }

    @GetMapping(value = "/users/{companyId}")
    @Operation(
            summary = "This Api is used to get company users by company id",
            parameters = {
                    @Parameter(name = "companyId", description = "The ID of the company"),
            }
    )

    public ResponseEntity<UserResponse> findCompanyUsers(
            @PathVariable(name = "companyId", required = true) Long companyId

    ) {
        var startMillis = System.currentTimeMillis();
        UUID requestId = UUID.randomUUID();
        log.info("Request received for Getting company users by company Id: {} with requestId:{}", companyId, requestId);

        var result = companyService.getCompanyById(requestId, null, companyId);
        UserResponse userResponse = new UserResponse(true, "", 0L, result.getUsers());

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Get company users by company id service took {} ms", timeTook);

        return new ResponseEntity<>(userResponse, HttpStatus.OK);
    }

    @GetMapping(value = "/services/{companyId}")
    @Operation(
            summary = "This Api is used to get company services by company id",
            parameters = {
                    @Parameter(name = "companyId", description = "The ID of the company"),
            }
    )
    public ResponseEntity<List<com.azm.apihub.backend.entities.CompanyService>> getAllCompanyServices(
            @PathVariable(name = "companyId", required = true) Long companyId

    ) {
        var startMillis = System.currentTimeMillis();
        UUID requestId = UUID.randomUUID();
        log.info("Request received for Getting company services by company Id: {} with requestId:{}", companyId, requestId);

        var result = companyService.findAllServiceHeadsByCompany(requestId, companyId);

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Get company services by company id service took {} ms", timeTook);

        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping(value = "/{companyId}/services/{serviceId}")
    @Operation(
            summary = "This Api is used to check whether service is subscribed by company or not",
            parameters = {
                    @Parameter(name = "companyId", description = "The ID of the company"),
                    @Parameter(name = "serviceId", description = "The ID of the service"),
            }
    )
    public ResponseEntity<SubscribedServiceResponse> checkServiceIsSubscribedByCompany(
            @PathVariable(name = "companyId") Long companyId,
            @PathVariable(name = "serviceId") Long serviceId

    ) {
        var startMillis = System.currentTimeMillis();
        UUID requestId = UUID.randomUUID();
        log.info("Request received for checking service is subscribed by company: {} with requestId:{}", companyId, requestId);

        var result = companyService.checkIsServiceSubscribed(requestId, companyId, serviceId);

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Check service subscribed service took {} ms", timeTook);

        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping(value = "/{id}/packages")
    @Operation(
            summary = "This Api is used to get allowed company packages by company id",
            parameters = {
                    @Parameter(name = "id", description = "The ID of the company"),
                    @Parameter(name = "packageType", description = "Input package type (ANNUAL or SERVICES)")
            }
    )
    public ResponseEntity<List<Package>> getAllCompanyAllowedPackages(
            Authentication authentication,
            @PathVariable(name = "id") Long companyId,
            @RequestParam(name = "packageType") PackageType packageType

    ) {
        var startMillis = System.currentTimeMillis();
        UUID requestId = UUID.randomUUID();
        log.info("Request received for Getting company allowed packages by company Id: {} with requestId:{}", companyId, requestId);

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        if(userDetails.getCompany() != null && !Objects.equals(userDetails.getCompany().getId(), companyId)) {
            throw new ForbiddenException("You are not allowed to get packages for this account");
        }

        List<CompanyPackageAllowed> result = companyService.findAllAllowedPackagesByCompany(requestId, null, companyId, packageType);

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Get company allowed packages by company id service took {} ms", timeTook);

        return new ResponseEntity<>(result.stream().map(cpa -> cpa.getAPackage()).collect(Collectors.toList()), HttpStatus.OK);
    }

    @GetMapping(value = "/{companyId}/sub-account/{subAccountId}/packages")
    @Operation(
            summary = "This Api is used to get allowed company packages by company id for sub accounts",
            parameters = {
                    @Parameter(name = "companyId", description = "The ID of the company"),
                    @Parameter(name = "subAccountId", description = "The ID of the sub account"),
                    @Parameter(name = "packageType", description = "Input package type (ANNUAL or SERVICES)")
            }
    )
    public ResponseEntity<List<Package>> getAllCompanySubAccountAllowedPackages(
            Authentication authentication,
            @PathVariable(name = "companyId") Long companyId,
            @PathVariable(name = "subAccountId") Long subAccountId,
            @RequestParam(name = "packageType") PackageType packageType

    ) {
        var startMillis = System.currentTimeMillis();
        UUID requestId = UUID.randomUUID();
        log.info("Request received for Getting sub account allowed packages by company Id: {} with requestId:{}", companyId, requestId);

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        if(!Objects.equals(userDetails.getCompany().getId(), subAccountId)
                && !Objects.equals(userDetails.getCompany().getMainAccountId(), companyId)) {
            throw new ForbiddenException("You are not allowed to get packages for this account");
        }

        List<CompanyPackageAllowed> result = companyService.findAllAllowedPackagesByCompany(requestId, companyId, subAccountId, packageType);

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Get sub account allowed packages by company id service took {} ms", timeTook);

        return new ResponseEntity<>(result.stream().map(cpa -> cpa.getAPackage()).collect(Collectors.toList()), HttpStatus.OK);
    }

    @PostMapping("/{id}/packages")
    @Operation(
            summary = "This Api is used to create select a package for a company"
    )
    @RequiresPermission({"package-add"})
    public ResponseEntity<CompanyPackageSelected> addPackageForCompany(@PathVariable(name = "id") Long companyId,
                                                                       @RequestBody @Validated CompanyPackageRequest companyPackageRequest,
                                                                       BindingResult bindingResult, Authentication authentication) {
        var startMillis = System.currentTimeMillis();
        UUID requestID = UUID.randomUUID();
        log.info("Request received for adding package for company with requestId:{}", requestID);

        companyPackageRequestValidator.validate(companyPackageRequest, bindingResult);
        ApiHubUtils.checkRequestErrors(bindingResult);
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        Company company = userService.getUserByUsername(userDetails.getUsername()).getCompany();


        if(company.getId().compareTo(companyId) != 0) {
            throw new BadRequestException("You can only make changes to your own company");
        }

        var result = companyService.assignPackageToCompany(requestID, company, companyPackageRequest);

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Add company package service took {} ms", timeTook);

        return new ResponseEntity<>(result, HttpStatus.CREATED);

    }

    @GetMapping(value = "/selected-packages")
    @Operation(
            summary = "This Api is used to get selected company packages by company id",
            parameters = {
                    @Parameter(name = "accountName", description = "The Account Name of the company to search"),
                    @Parameter(name = "packageName", description = "The package Name to search"),
                    @Parameter(name = "pageSize", description = "The Number of Entries on the page"),
                    @Parameter(name = "pageNumber", description = "The Page Number of Selected Packages"),
                    @Parameter(name= "packageType", description = "The Package Type of Selected Packages")
            }
    )
    public ResponseEntity<CompanyPackageSelectedResponse> getAllCompanySelectedPackages(
            Authentication authentication,
            @RequestParam (required = false) String accountName,
            @RequestParam(required = false) String packageName,
            @RequestParam(defaultValue = "1") int pageNumber,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam (required = false) PackageStatus packageStatus,
            @RequestParam (required = false) PackageType packageType ) {
        var startMillis = System.currentTimeMillis();
        UUID requestId = UUID.randomUUID();

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        CompanyPackageSelectedResponse result;
        if(userDetails.isAdmin()) {
            log.info("Request received for Getting selected packages for admin with requestId:{}", requestId);
            result = companyService.findAllSelectedPackages(requestId, accountName, packageName, pageNumber, pageSize, packageStatus);
        } else {
            log.info("Request received for Getting company selected packages with requestId:{}", requestId);
            result = companyService.findAllSelectedPackagesByCompany(requestId, null, userDetails.getCompany().getId(), packageName, pageNumber, pageSize, packageStatus, packageType);
        }

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Get company selected packages service took {} ms", timeTook);

        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping(value = "{companyId}/sub-account/{subAccountId}/selected-packages")
    @Operation(
            summary = "This Api is used to get selected company packages by company id",
            parameters = {
                    @Parameter(name = "companyId", description = "The id of the main Account"),
                    @Parameter(name = "subAccountId", description = "The id of the sub Account"),
                    @Parameter(name = "accountName", description = "The Account Name of the company to search"),
                    @Parameter(name = "packageName", description = "The package Name to search"),
                    @Parameter(name = "pageSize", description = "The Number of Entries on the page"),
                    @Parameter(name = "pageNumber", description = "The Page Number of Selected Packages"),
                    @Parameter(name= "packageType", description = "The Package Type of Selected Packages")
            }
    )
    public ResponseEntity<CompanyPackageSelectedResponse> getAllCompanySubAccountSelectedPackages(
            Authentication authentication,
            @PathVariable(name = "companyId") Long companyId,
            @PathVariable(name = "subAccountId") Long subAccountId,
            @RequestParam(required = false) String packageName,
            @RequestParam(defaultValue = "1") int pageNumber,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam (required = false) PackageStatus packageStatus,
            @RequestParam (required = false) PackageType packageType ) {
        var startMillis = System.currentTimeMillis();
        UUID requestId = UUID.randomUUID();

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        if(!Objects.equals(userDetails.getCompany().getId(), subAccountId)
                && !Objects.equals(userDetails.getCompany().getMainAccountId(), companyId)) {
            throw new ForbiddenException("You are not allowed to get selected packages for this account");
        }

        CompanyPackageSelectedResponse result;

        log.info("Request received for Getting sub account selected packages with requestId:{}", requestId);
        result = companyService.findAllSelectedPackagesByCompany(requestId, companyId, subAccountId, packageName, pageNumber, pageSize, packageStatus, packageType);

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Get sub account selected packages service took {} ms", timeTook);

        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping(value = "/{id}/integration-selected-packages")
    @Operation(
            summary = "This Api is used to get selected company packages by company id for integration service",
            parameters = {
                    @Parameter(name = "companyId", description = "The ID of the company")
            }
    )
    @Hidden
    public ResponseEntity<List<CompanyPackageSelected>> getAllCompanySelectedPackagesForIntegrationService(@PathVariable(name = "id") Long companyId) {
        var startMillis = System.currentTimeMillis();
        UUID requestId = UUID.randomUUID();
        log.info("Request received for Getting company selected packages by company Id for integration service: {} with requestId:{}", companyId, requestId);

        var result = companyService.findAllSelectedPackagesByCompanyWithoutPagination(requestId, companyId);

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Get company selected packages by company id for integration service service took {} ms", timeTook);

        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @PutMapping("/selected-packages/{packageId}")
    @Operation(
            summary = "This Api is used to create select a package for a company"
    )
    @Hidden
    public ResponseEntity<CompanyPackageSelected> UpdateSelectedPackageConsumptionForCompany(@PathVariable(name = "packageId") Long selectedPackageId,
                                                                                             @RequestBody SelectedPackageUpdateConsumptionRequest companyPackageRequest) {
        var startMillis = System.currentTimeMillis();
        UUID requestID = UUID.randomUUID();
        log.info("Request received for updating selected package for company from integration with requestId:{}", requestID);

        var result = companyService.updateSelectedPackageConsumption(requestID, selectedPackageId, companyPackageRequest);

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Updated selected company package from integration service took {} ms", timeTook);

        return new ResponseEntity<>(result, HttpStatus.CREATED);

    }

    @PostMapping (value = "/{companyId}/service-heads/{serviceHeadId}/subscribe")
    @Operation(
            summary = "This Api is used to subscribe service head by company",
            parameters = {
                    @Parameter(name = "companyId", description = "The ID of the company"),
                    @Parameter(name = "serviceHeadId", description = "The ID of the service-head"),
            }
    )
    @RequiresPermission("service-subscribe")
    public void subscribeAccountServiceHead(Authentication authentication, @PathVariable Long companyId, @PathVariable Long serviceHeadId){
        var startMillis = System.currentTimeMillis();
        UUID requestID = UUID.randomUUID();

        com.azm.apihub.backend.users.models.UserDetails user =
                ((com.azm.apihub.backend.users.models.UserDetails) authentication.getPrincipal());

        if (!user.getCompany().getId().equals(companyId)) {
            throw new BadRequestException("Invalid Request to Subscribe Service Head");
        }
        log.info("Request received for Subscribing the Service Head {}", requestID);

        companyService.subscribeAccountServiceHead(companyId, serviceHeadId);

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Subscribing the service {} ms", timeTook);
    }

    @GetMapping (value = "/{companyId}/service-heads/{serviceHeadId}/is-subscribed")
    @Operation(
            summary = "This Api is used to check whether service is subscribed by company or not",
            parameters = {
                    @Parameter(name = "companyId", description = "The ID of the company"),
                    @Parameter(name = "serviceHeadId", description = "The ID of the service-head"),
            }
    )
    @Hidden
    public ResponseEntity<IsServiceHeadSubscribe> checkIsSubscribedServiceHead(@PathVariable Long companyId, @PathVariable Long serviceHeadId){
        var startMillis = System.currentTimeMillis();
        UUID requestID = UUID.randomUUID();

        log.info("Request received for checking subscription of the Service Head {}", requestID);

        var result = companyService.checkIsServiceHeadSubscribedByCompany(companyId, serviceHeadId);

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Check subscription of service head service took {} ms", timeTook);

        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}
