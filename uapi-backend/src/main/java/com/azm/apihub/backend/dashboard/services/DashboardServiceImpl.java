package com.azm.apihub.backend.dashboard.services;

import com.azm.apihub.backend.companies.repository.CompanyRepository;
import com.azm.apihub.backend.dashboard.mapper.*;
import com.azm.apihub.backend.dashboard.models.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class DashboardServiceImpl implements DashboardService {

    private final CompanyRepository companyRepository;
    private final NamedParameterJdbcTemplate jdbcTemplate;
    private final DashboardWidgetRequestMaker dashboardWidgetRequestMaker;

    @Autowired
    public DashboardServiceImpl(CompanyRepository companyRepository,
                                @Qualifier("ApiHubAccountsTemplate") NamedParameterJdbcTemplate jdbcTemplate,
                                DashboardWidgetRequestMaker dashboardWidgetRequestMaker) {
        this.companyRepository = companyRepository;
        this.jdbcTemplate = jdbcTemplate;
        this.dashboardWidgetRequestMaker = dashboardWidgetRequestMaker;
    }

    @Override
    public NoOfActiveAccountsResponse getNoOfActiveAccounts() {
        var noOfActiveAccounts = companyRepository.countCompaniesByIsActiveTrueAndIsDeletedFalse();
        var noOfInactiveAccounts = companyRepository.countCompaniesByIsActiveFalseAndIsDeletedFalse();
        log.info("Total number of active accounts: {}", noOfActiveAccounts);
        log.info("Total number of inactive accounts: {}", noOfInactiveAccounts);
        return new NoOfActiveAccountsResponse(noOfActiveAccounts, noOfInactiveAccounts);
    }

    @Override
    public List<NoOfAccountPerInvoiceStatusResult> getNoOfAccountsPerInvoiceStatus() {
        String query = dashboardWidgetRequestMaker.createSqlForCountAccountPerInvoiceStatus();
        log.info("Query for Counting Account Per Invoice Status: {}", query);

        return jdbcTemplate.query(query, new NoOfAccountPerInvoiceStatusRowMapper());
    }

    @Override
    public List<NoOfAccountsByPackagesResponse> getNoOfAccountsByPackageType() {
        String query = dashboardWidgetRequestMaker.createSqlForCountAccountByPackageType();
        log.info("Query for Counting Account By Package Type: {}", query);

        return jdbcTemplate.query(query, new NoOfAccountByPackageTypeRowMapper());
    }

    @Override
    public List<NoOfAccountsByServiceProviderResponse> getNoOfAccountsByServiceProvider() {
        String query = dashboardWidgetRequestMaker.createSqlForCountAccountByServiceProvider();
        log.info("Query for Counting Account By Service Provider: {}", query);

        return jdbcTemplate.query(query, new NoOfAccountByServiceProviderRowMapper());
    }

    @Override
    public List<NoOfInvoicesByStatusResponse> getInvoiceCountByStatusAndCompany(Long companyId) {
        String query = dashboardWidgetRequestMaker.createSqlForCountInvoiceByStatusAndCompany();
        MapSqlParameterSource parameters = dashboardWidgetRequestMaker.createParameters(companyId);

        log.info("Query for Counting Invoices By Status: {}", query);

        return jdbcTemplate.query(query, parameters, new NoOfInvoicesByStatusRowMapper());
    }

    @Override
    public NoOfPrepaidAndPostpaidAccountsResponse getNoOfPrepaidAndPostpaidAccounts() {
        String query = dashboardWidgetRequestMaker.createSqlForCountPrepaidAndPostpaidAccounts();
        log.info("Query for Counting Prepaid And Postpaid Accounts: {}", query);

        return jdbcTemplate.queryForObject(query, new HashMap<>(), new NoOfPrepaidAndPostpaidAccountsRowMapper());
    }

    @Override
    public List<TopConsumedServicesResponse> getTopConsumedServicesByCompany(Long companyId) {
        String query = dashboardWidgetRequestMaker.createSqlForTopConsumedServicesByCompany();
        MapSqlParameterSource parameters = dashboardWidgetRequestMaker.createParameters(companyId);
        log.info("Query for Top Consumed Services By Company: {}", query);

        return jdbcTemplate.query(query, parameters, new TopConsumedServicesRowMapper());
    }

    @Override
    public ServicesCountByUserResponse getServicesCountByByCompany(Long companyId) {
        String query = dashboardWidgetRequestMaker.createSqlForServicesCountByCompany();
        log.info("Query for Subscribed and Unsubscribed services against loggedIn User's Company: {}", query);

        return jdbcTemplate.queryForObject(query, Collections.singletonMap("companyId", companyId), new ServicesCountByUserRowMapper());
    }
}
