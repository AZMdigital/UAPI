package com.azm.apihub.backend.entities;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;
import java.sql.Timestamp;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinColumns;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "company_package_selected", schema = "apihub")
public class CompanyPackageSelected {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @JsonManagedReference
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumns({
            @JoinColumn(name = "company_id", referencedColumnName = "id")
    })
    private Company company;

    @JsonProperty("package")
    @JsonManagedReference
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumns({
            @JoinColumn(name = "package_id", referencedColumnName = "id")
    })
    private Package cPackage;

    @Column(name = "activation_date", nullable = false)
    private Timestamp activationDate;

    @Column(name = "price_consumption")
    private BigDecimal priceConsumption;

    @Column(name = "transaction_consumption")
    private Integer transactionConsumption;

    @Enumerated(EnumType.STRING)
    @Column(name = "package_status", nullable = false)
    private PackageStatus packageStatus;

    @Column(name = "created_at", nullable = false)
    private Timestamp createdAt;

    @Column(name = "updated_at", nullable = false)
    private Timestamp updatedAt;

    @Column(name = "email_sent_threshold")
    private Integer emailSentThreshold;

    @Column(name = "email_sent_at")
    private Timestamp emailSentAt;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "updated_by")
    private String updatedBy;
}

