package com.azm.apihub.backend.dashboard.mapper;

import com.azm.apihub.backend.dashboard.models.NoOfAccountsByPackagesResponse;
import java.sql.ResultSet;
import java.sql.SQLException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.RowMapper;

@Slf4j
public class NoOfAccountByPackageTypeRowMapper implements RowMapper<NoOfAccountsByPackagesResponse> {

    @Override
    public NoOfAccountsByPackagesResponse mapRow(ResultSet row, int i) throws SQLException {
        Long noOfAccounts = row.getLong("number_of_accounts");
        String packageType = row.getString("package_type");

        return new NoOfAccountsByPackagesResponse(
                noOfAccounts,
                packageType
        );
    }
}

