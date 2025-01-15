package com.azm.apihub.backend.dashboard.mapper;

import com.azm.apihub.backend.dashboard.models.NoOfPrepaidAndPostpaidAccountsResponse;
import java.sql.ResultSet;
import java.sql.SQLException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.RowMapper;

@Slf4j
public class NoOfPrepaidAndPostpaidAccountsRowMapper implements RowMapper<NoOfPrepaidAndPostpaidAccountsResponse> {

    @Override
    public NoOfPrepaidAndPostpaidAccountsResponse mapRow(ResultSet row, int i) throws SQLException {
        Long noOfPostpaidAccounts = row.getLong("number_of_postpaid_accounts");
        Long noOfPrepaidAccounts = row.getLong("number_of_prepaid_accounts");

        return new NoOfPrepaidAndPostpaidAccountsResponse(
                noOfPrepaidAccounts,
                noOfPostpaidAccounts
        );
    }
}

