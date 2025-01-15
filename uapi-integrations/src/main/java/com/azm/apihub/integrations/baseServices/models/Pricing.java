package com.azm.apihub.integrations.baseServices.models;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Pricing {
    private Long id;

    private String name;

    private Double fixedSuccessPrice;

    private Double failurePricePercentage;

    private Double fixedFailurePrice;

    private Boolean isTier;

    private Timestamp createdAt;

    private Timestamp updatedAt;

    private String createdBy;

    private String updatedBy;

    private List<PricingTier> pricingTiers = new ArrayList<>();
}