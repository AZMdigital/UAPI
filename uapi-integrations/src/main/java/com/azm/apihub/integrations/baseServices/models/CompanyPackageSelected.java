package com.azm.apihub.integrations.baseServices.models;

import com.azm.apihub.integrations.baseServices.dto.Company;
import com.azm.apihub.integrations.baseServices.models.enums.PackageStatus;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.google.gson.annotations.SerializedName;
import java.math.BigDecimal;
import java.sql.Timestamp;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CompanyPackageSelected {
    private Long id;

    @SerializedName("package")
    private Package cPackage;

    private Timestamp activationDate;

    private Double priceConsumption;

    private Integer transactionConsumption;

    private PackageStatus packageStatus;

    private Timestamp createdAt;

    private Timestamp updatedAt;

    private String createdBy;

    private String updatedBy;
}