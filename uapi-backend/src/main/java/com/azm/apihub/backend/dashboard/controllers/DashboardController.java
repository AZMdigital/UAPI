package com.azm.apihub.backend.dashboard.controllers;

import com.azm.apihub.backend.dashboard.models.NoOfAccountPerInvoiceStatusResult;
import com.azm.apihub.backend.dashboard.models.NoOfAccountsByPackagesResponse;
import com.azm.apihub.backend.dashboard.models.NoOfAccountsByServiceProviderResponse;
import com.azm.apihub.backend.dashboard.models.NoOfActiveAccountsResponse;
import com.azm.apihub.backend.dashboard.models.NoOfPrepaidAndPostpaidAccountsResponse;
import com.azm.apihub.backend.dashboard.models.ServicesCountByUserResponse;
import com.azm.apihub.backend.dashboard.models.NoOfInvoicesByStatusResponse;
import com.azm.apihub.backend.dashboard.models.TopConsumedServicesResponse;
import com.azm.apihub.backend.dashboard.services.DashboardService;
import com.azm.apihub.backend.exceptions.ForbiddenException;
import com.azm.apihub.backend.users.models.UserDetails;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/dashboard")
@Tag(name = "Dashboard widgets")
@AllArgsConstructor
@Slf4j
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/active-accounts")
    @Operation(
            summary = "This Api is used to get Number of all active accounts"
    )
    public ResponseEntity<NoOfActiveAccountsResponse> getNoOfActiveAccounts() {

        var startMillis = System.currentTimeMillis();


        UUID requestId = UUID.randomUUID();
        log.info("Request received for getting No. of active accounts with request id:{}", requestId);

        var result = dashboardService.getNoOfActiveAccounts();

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("No.of active accounts service took {} ms", timeTook);

        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/accounts-per-invoice-status")
    @Operation(
            summary = "This Api is used to get Number of accounts per invoice status"
    )
    public ResponseEntity<List<NoOfAccountPerInvoiceStatusResult>> getNoOfAccountsPerInvoiceStatus() {

        var startMillis = System.currentTimeMillis();


        UUID requestId = UUID.randomUUID();
        log.info("Request received for getting No. of accounts per invoice status with request id:{}", requestId);

        var result = dashboardService.getNoOfAccountsPerInvoiceStatus();

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("No.of accounts per invoice status service took {} ms", timeTook);

        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/accounts-by-package-type")
    @Operation(
            summary = "This Api is used to get Number of accounts By Package Type (ANNUAL or SERVICES)"
    )
    public ResponseEntity<List<NoOfAccountsByPackagesResponse>> getAccountsByPackageType() {

        var startMillis = System.currentTimeMillis();


        UUID requestId = UUID.randomUUID();
        log.info("Request received for getting No. of accounts by package type with request id:{}", requestId);

        var result = dashboardService.getNoOfAccountsByPackageType();

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("No.of accounts by package type service took {} ms", timeTook);

        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/accounts-by-service-providers")
    @Operation(
            summary = "This Api is used to get Number of accounts By Service Providers"
    )
    public ResponseEntity<List<NoOfAccountsByServiceProviderResponse>> getAccountsByServiceProviders() {

        var startMillis = System.currentTimeMillis();

        UUID requestId = UUID.randomUUID();
        log.info("Request received for getting No. of accounts by service providers with request id:{}", requestId);

        var result = dashboardService.getNoOfAccountsByServiceProvider();

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("No.of accounts by service providers service took {} ms", timeTook);

        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/dev-portal/invoice-by-status")
    @Operation(
            summary = "This Api is used to get Number of Invoices By Invoice Status (NEW, PENDING, ISSUED, PAID, FAILED)"
    )
    public ResponseEntity<List<NoOfInvoicesByStatusResponse>> getInvoiceCountByStatus(Authentication authentication) {

        var startMillis = System.currentTimeMillis();

        UUID requestId = UUID.randomUUID();
        log.info("Request received for getting No. of Invoices By Invoice Status with request id:{}", requestId);

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        if(userDetails.isAdmin())
            throw new ForbiddenException("This is only of dev portal");

        var result = dashboardService.getInvoiceCountByStatusAndCompany(userDetails.getCompany().getId());

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("No.of of Invoices By Invoice Status service took {} ms", timeTook);

        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/accounts-by-prepaid-postpaid")
    @Operation(
            summary = "This Api is used to get Number of accounts who subscribe to postpaid and prepaid"
    )
    public ResponseEntity<NoOfPrepaidAndPostpaidAccountsResponse> getPrepaidAndPostpaidAccounts() {

        var startMillis = System.currentTimeMillis();

        UUID requestId = UUID.randomUUID();
        log.info("Request received for getting No. of prepaid and postpaid accounts with request id:{}", requestId);

        var result = dashboardService.getNoOfPrepaidAndPostpaidAccounts();

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("No.of prepaid and postpaid accounts service took {} ms", timeTook);

        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/dev-portal/top-consumed-services")
    @Operation(
            summary = "This Api is used to get Top Consumed Services By Company"
    )
    public ResponseEntity<List<TopConsumedServicesResponse>> getTopConsumedServicesByCompany(Authentication authentication) {

        var startMillis = System.currentTimeMillis();

        UUID requestId = UUID.randomUUID();
        log.info("Request received for getting Top Consumed Services By Company with request id:{}", requestId);

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        if(userDetails.isAdmin())
            throw new ForbiddenException("This is only of dev portal");

        var result = dashboardService.getTopConsumedServicesByCompany(userDetails.getCompany().getId());

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Top Consumed Services By Company took {} ms", timeTook);

        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/dev-portal/services-count-by-user")
    @Operation(
            summary = "This Api is used to get Subscribed and Unsubscribed services against loggedIn User"
    )
    public ResponseEntity<ServicesCountByUserResponse> getServicesCountByLoggedInUserCompany(Authentication authentication) {

        var startMillis = System.currentTimeMillis();

        UUID requestId = UUID.randomUUID();
        log.info("Request received for getting Subscribed and Unsubscribed services against loggedIn User's Company with request id:{}", requestId);

        ServicesCountByUserResponse result = null;

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        if(userDetails.isAdmin())
            throw new ForbiddenException("This is only of dev portal");

        result = dashboardService.getServicesCountByByCompany(userDetails.getCompany().getId());

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Subscribed and Unsubscribed services against loggedIn User's Company took {} ms", timeTook);

        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}
