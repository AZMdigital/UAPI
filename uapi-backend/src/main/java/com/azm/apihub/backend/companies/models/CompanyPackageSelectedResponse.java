package com.azm.apihub.backend.companies.models;

import com.azm.apihub.backend.consumption.models.ServiceConsumptionDetail;
import com.azm.apihub.backend.entities.CompanyPackageSelected;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CompanyPackageSelectedResponse {

    long totalRecords;
    private List<CompanyPackageSelected> companyPackageSelectedList;
}
