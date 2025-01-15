package com.azm.apihub.backend.companies.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SelectedPackageUpdateConsumptionRequest {

    private Double priceConsumption;

    private Integer transactionConsumption;
}