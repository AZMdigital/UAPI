package com.azm.apihub.backend.dashboard.mapper;

import com.azm.apihub.backend.dashboard.models.NoOfAccountPerInvoiceStatusResult;
import java.sql.ResultSet;
import java.sql.SQLException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.RowMapper;

@Slf4j
public class NoOfAccountPerInvoiceStatusRowMapper implements RowMapper<NoOfAccountPerInvoiceStatusResult> {

    @Override
    public NoOfAccountPerInvoiceStatusResult mapRow(ResultSet row, int i) throws SQLException {
        Long noOfAccounts = row.getLong("number_of_accounts");
        String invoiceStatus = row.getString("invoice_status");

        return new NoOfAccountPerInvoiceStatusResult(
                noOfAccounts,
                invoiceStatus
        );
    }
}

