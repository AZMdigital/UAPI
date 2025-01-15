package com.azm.apihub.backend.dashboard.services;

import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class DashboardWidgetRequestMaker {

    public String createSqlForCountAccountPerInvoiceStatus() {
        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder.append("SELECT ")
                .append("COUNT(DISTINCT cps.company_id) AS number_of_accounts, inv.invoice_status ")
                .append("FROM apihub.invoice inv ")
                .append("LEFT JOIN apihub.company_package_selected cps ON cps.id = inv.company_package_selected_id ")
                .append("GROUP BY inv.invoice_status");

        return sqlBuilder.toString();
    }

    public String createSqlForCountAccountByPackageType() {
        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder.append("SELECT ")
                .append("COUNT(DISTINCT cps.company_id) AS number_of_accounts, p.package_type ")
                .append("FROM apihub.company_package_selected cps ")
                .append("LEFT JOIN apihub.package p ON p.id = cps.package_id ")
                .append("GROUP BY p.package_type");

        return sqlBuilder.toString();
    }

    public String createSqlForCountAccountByServiceProvider() {
        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder.append("SELECT ")
                .append("COUNT(DISTINCT cs.company_id) AS number_of_accounts, sp.name AS service_provider_name ")
                .append("FROM apihub.company_service cs ")
                .append("LEFT JOIN apihub.api_hub_company c on c.id = cs.company_id ")
                .append("LEFT JOIN apihub.service s on s.id = cs.service_id ")
                .append("LEFT JOIN apihub.service_head sh on sh.id = s.service_head_id ")
                .append("LEFT JOIN apihub.service_provider sp on sp.id = sh.service_provider_id ")
                .append("WHERE c.is_active = true AND c.is_deleted = false ")
                .append("GROUP BY sp.name");

        return sqlBuilder.toString();
    }

    public String createSqlForCountInvoiceByStatusAndCompany() {
        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder.append("SELECT ")
                .append("inv.invoice_status, count(inv.id) AS no_of_invoices ")
                .append("FROM apihub.invoice inv ")
                .append("LEFT JOIN apihub.company_package_selected cps on cps.id = inv.company_package_selected_id ")
                .append("WHERE cps.company_id = :companyId ")
                .append("GROUP BY inv.invoice_status");

        return sqlBuilder.toString();
    }

    public String createSqlForCountPrepaidAndPostpaidAccounts() {
        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder.append("SELECT ")
                .append("COUNT(DISTINCT CASE WHEN c.services_postpaid_subscribed = true THEN c.id END) AS number_of_postpaid_accounts, ")
                .append("COUNT(DISTINCT CASE WHEN package.package_type = 'SERVICES' AND cps.package_status = 'ACTIVE' THEN cps.company_id END) AS number_of_prepaid_accounts ")
                .append("FROM apihub.api_hub_company c ")
                .append("LEFT JOIN apihub.company_package_selected cps ON cps.company_id = c.id ")
                .append("LEFT JOIN apihub.package package ON package.id = cps.package_id ")
                .append("WHERE c.is_active = true AND c.is_deleted = false ");

        return sqlBuilder.toString();
    }

    public String createSqlForServicesCountByCompany() {
        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder.append("SELECT ")
                .append("(SELECT COUNT(DISTINCT s.id) ")
                .append("FROM apihub.service s ")
                .append("INNER JOIN apihub.account_service_head_subscriptions ashs ON s.service_head_id = ashs.service_head_id ")
                .append("WHERE ashs.company_id = :companyId) AS subscribed_service_count, ")
                .append("(SELECT COUNT(DISTINCT s.id) ")
                .append("FROM apihub.service s ")
                .append("LEFT JOIN apihub.account_service_head_subscriptions ashs ON s.service_head_id = ashs.service_head_id AND ashs.company_id = :companyId ")
                .append("WHERE ashs.service_head_id IS NULL) AS unsubscribed_service_count ");

        return sqlBuilder.toString();
    }

    public String createSqlForTopConsumedServicesByCompany() {
        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder.append("SELECT ")
                .append("sv.id AS service_id, sv.name AS service_name, COUNT(rl.id) AS no_of_hits ")
                .append("FROM apihub.request_logs rl ")
                .append("LEFT JOIN apihub.service sv ON sv.id = rl.service_id ")
                .append("where rl.company_id = :companyId and rl.service_id is not null and rl.is_mockup = false ")
                .append("GROUP BY sv.id ")
                .append("ORDER BY no_of_hits DESC ")
                .append("LIMIT 5");

        return sqlBuilder.toString();
    }

    public MapSqlParameterSource createParameters(Long companyId) {
        MapSqlParameterSource parameters = new MapSqlParameterSource();

        if (companyId != null)
            parameters.addValue("companyId", companyId);

        return parameters;
    }
}
