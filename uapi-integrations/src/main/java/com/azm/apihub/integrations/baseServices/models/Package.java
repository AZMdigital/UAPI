package com.azm.apihub.integrations.baseServices.models;

import com.azm.apihub.integrations.baseServices.models.enums.PackagePeriod;
import com.azm.apihub.integrations.baseServices.models.enums.PackageType;
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
public class Package {
    private Long id;

    private String name;

    private String arabicName;

    private Long transactionLimit;

    private Double pricePerPeriod;

    private Boolean isActive;

    private Timestamp createdAt;

    private Timestamp updatedAt;

    private String createdBy;

    private String updatedBy;

    private String packageCode;

    private Timestamp activationDate;

    private PackageType packageType;

    private PackagePeriod packagePeriod;

}