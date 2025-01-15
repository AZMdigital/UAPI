package com.azm.apihub.backend.dashboard.models;

import com.azm.apihub.backend.entities.InvoiceStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class NoOfInvoicesByStatusResponse {
    Long noOfInvoices;
    InvoiceStatus invoiceStatus;
}
