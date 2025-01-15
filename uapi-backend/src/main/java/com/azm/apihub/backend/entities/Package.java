package com.azm.apihub.backend.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.List;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
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
@Table(name = "package", schema = "apihub")
public class Package {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "arabic_name")
    private String arabicName;

    @Column(name = "transaction_limit")
    private Long transactionLimit;

    @Column(name = "price_per_period")
    private BigDecimal pricePerPeriod;

    @Column(name = "is_active")
    private Boolean isActive;

    @Column(name = "created_at", nullable = false)
    private Timestamp createdAt;

    @Column(name = "updated_at", nullable = false)
    private Timestamp updatedAt;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "updated_by")
    private String updatedBy;

    @Column(name = "package_code")
    private String packageCode;

    @Enumerated(EnumType.STRING)
    @Column(name = "package_type")
    private PackageType packageType;

    @Enumerated(EnumType.STRING)
    @Column(name = "package_period")
    private PackagePeriod packagePeriod;

    @JsonBackReference
    @OneToMany(mappedBy = "aPackage", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<CompanyPackageAllowed> companyPackageAllowed;

    @JsonBackReference
    @OneToMany(mappedBy = "cPackage", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<CompanyPackageSelected> companyPackageSelected;

}
