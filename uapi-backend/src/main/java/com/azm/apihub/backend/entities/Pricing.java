package com.azm.apihub.backend.entities;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "pricing", schema = "apihub")
public class Pricing {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "fixed_success_price")
    private BigDecimal fixedSuccessPrice;

    @Column(name = "failure_price_percentage")
    private BigDecimal failurePricePercentage;

    @Column(name = "fixed_failure_price")
    private BigDecimal fixedFailurePrice;

    @Column(name = "is_tier", nullable = false)
    private Boolean isTier;

    @Column(name = "created_at", nullable = false)
    private Timestamp createdAt;

    @Column(name = "updated_at", nullable = false)
    private Timestamp updatedAt;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "updated_by")
    private String updatedBy;

    @JsonManagedReference
    @OneToMany(mappedBy = "pricing", fetch = FetchType.EAGER)
    private List<PricingTier> pricingTiers = new ArrayList<>();
}
