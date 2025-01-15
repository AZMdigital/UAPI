package com.azm.apihub.integrations.baseServices.models;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ServiceConsumptionHistoryRequest {
    private BigDecimal consumedPrice;
    private Boolean isTier;
    private String transactionStatus;
    private String serviceType;
    private Boolean isMockup;
    private Boolean clientCredentialUsed;
    private Long companyPackageSelectedId;
    private Long pricingId;
    private String companyName;
    private String companyUnifiedNationalNumber;
    private String serviceName;
    private String serviceCode;
    private String errorCode;
    private String errorDescription;
    private Integer responseCode;
    private Long mainAccountId;
    private String accountType;
    private Boolean useMainAccountBundles;
}
