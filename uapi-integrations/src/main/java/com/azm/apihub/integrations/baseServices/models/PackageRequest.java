package com.azm.apihub.integrations.baseServices.models;

import com.azm.apihub.integrations.baseServices.models.enums.PackagePeriod;
import com.azm.apihub.integrations.baseServices.models.enums.PackageType;
import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PackageRequest {

    private String name;
    private String arabicName;
    private Double pricePerPeriod;
    private PackagePeriod packagePeriod;
    private Boolean active;
    private LocalDate activationDate;
    private PackageType packageType;
    private Long transactionLimit;
}