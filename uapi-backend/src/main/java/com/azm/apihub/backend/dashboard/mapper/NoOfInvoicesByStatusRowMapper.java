package com.azm.apihub.backend.dashboard.mapper;

import com.azm.apihub.backend.dashboard.models.NoOfInvoicesByStatusResponse;
import com.azm.apihub.backend.entities.InvoiceStatus;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

@Slf4j
public class NoOfInvoicesByStatusRowMapper implements RowMapper<NoOfInvoicesByStatusResponse> {

    @Override
    public NoOfInvoicesByStatusResponse mapRow(ResultSet row, int i) throws SQLException {
        String invoiceStatus = row.getString("invoice_status");
        Long noOfInvoices = row.getLong("no_of_invoices");

        return new NoOfInvoicesByStatusResponse(
                noOfInvoices,
                InvoiceStatus.valueOf(invoiceStatus)
        );
    }
}

