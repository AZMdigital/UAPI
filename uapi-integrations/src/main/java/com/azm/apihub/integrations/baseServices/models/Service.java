package com.azm.apihub.integrations.baseServices.models;

import com.azm.apihub.integrations.baseServices.models.enums.PricingType;
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
public class Service {
    private Long id;
    private String name;
    private String serviceCode;
    private String arabic_name;
    private String handle;
    private Boolean isActive;
    private Long serviceHeadId;
    private Timestamp createdAt;
    private Timestamp updatedAt;
    private String createdBy;
    private String updatedBy;
    private Boolean isMock;
    private Pricing pricing;
    private PricingType pricingType;
}
