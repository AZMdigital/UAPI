package com.azm.apihub.backend.dashboard.mapper;

import com.azm.apihub.backend.dashboard.models.NoOfAccountsByServiceProviderResponse;
import java.sql.ResultSet;
import java.sql.SQLException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.RowMapper;

@Slf4j
public class NoOfAccountByServiceProviderRowMapper implements RowMapper<NoOfAccountsByServiceProviderResponse> {

    @Override
    public NoOfAccountsByServiceProviderResponse mapRow(ResultSet row, int i) throws SQLException {
        Long noOfAccounts = row.getLong("number_of_accounts");
        String serviceProviderName = row.getString("service_provider_name");

        return new NoOfAccountsByServiceProviderResponse(
                noOfAccounts,
                serviceProviderName
        );
    }
}

