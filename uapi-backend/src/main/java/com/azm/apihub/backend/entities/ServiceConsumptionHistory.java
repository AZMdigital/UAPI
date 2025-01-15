package com.azm.apihub.backend.entities;

import java.math.BigDecimal;
import java.sql.Timestamp;
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
@Table(name = "service_consumption_history", schema = "apihub")
public class ServiceConsumptionHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "company_id", nullable = false)
    private Long companyId;

    @Column(name = "company_name", nullable = false)
    private String companyName;

    @Column(name = "company_unified_national_number", nullable = false)
    private String companyUnifiedNationalNumber;

    @Column(name = "service_id", nullable = false)
    private Long serviceId;

    @Column(name = "service_name", nullable = false)
    private String serviceName;

    @Column(name = "service_code", nullable = false)
    private String serviceCode;

    @Column(name = "invoice_id")
    private Long invoiceId;

    @Column(name = "consumed_price")
    private BigDecimal consumedPrice;

    @Column(name = "is_tier", nullable = false)
    private Boolean isTier;

    @Column(name = "transaction_status")
    private String transactionStatus;

    @Column(name = "service_type", nullable = false)
    private String serviceType;

    @Column(name = "invoice_generated", nullable = false)
    private Boolean invoiceGenerated;

    @Column(name = "is_mockup", nullable = false)
    private Boolean isMockup;

    @Column(name = "client_credential_used", nullable = false)
    private Boolean clientCredentialUsed;

    @Column(name = "company_package_selected_id")
    private Long companyPackageSelectedId;

    @Column(name = "error_code")
    private String errorCode;

    @Column(name = "error_description")
    private String errorDescription;

    @Column(name = "response_code")
    private Integer responseCode;

    @Column(name = "pricing_id")
    private Long pricingId;

    @Column(name = "main_account_id")
    private Long mainAccountId;

    @Column(name = "main_account_name")
    private String mainAccountName;

    @Column(name = "account_type")
    private String accountType;

    @Column(name = "use_main_account_bundles", nullable = false)
    private Boolean useMainAccountBundles;

    @Column(name = "created_at", nullable = false)
    private Timestamp createdAt;
}

