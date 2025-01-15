package com.azm.apihub.backend.packages.models;

import com.azm.apihub.backend.entities.PackagePeriod;
import com.azm.apihub.backend.entities.PackageType;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PackageRequest {

    private String name;
    private String arabicName;
    private BigDecimal pricePerPeriod;
    private PackagePeriod packagePeriod;
    private Boolean active;
    private PackageType packageType;
    private Long transactionLimit;
}