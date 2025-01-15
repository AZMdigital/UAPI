package com.azm.apihub.backend.entities;

import javax.persistence.*;

import com.azm.apihub.backend.attachments.models.AttachmentDTO;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import java.sql.Timestamp;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "company_request", schema = "apihub")
public class OnboardCompanyRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "request_number", nullable = false)
    private String requestNumber;

    @Column(name = "company_address_building_number", nullable = false)
    private String companyAddressBuildingNumber;

    @Column(name = "company_address_secondary_number")
    private String companyAddressSecondaryNumber;

    @Column(name = "company_address_district", nullable = false)
    private String companyAddressDistrict;

    @Column(name = "company_address_postal_code", nullable = false)
    private String companyAddressPostalCode;

    @Column(name = "company_address_country", nullable = false)
    private String companyAddressCountry;

    @JsonManagedReference
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "company_address_city_id", referencedColumnName = "id")
    private LookupValue companyAddressCity;

    @Column(name = "company_rep_first_name", nullable = false)
    private String companyRepFirstName;

    @Column(name = "company_rep_last_name", nullable = false)
    private String companyRepLastName;

    @Column(name = "company_rep_national_id", nullable = false)
    private String companyRepNationalId;

    @Column(name = "company_rep_email", nullable = false)
    private String companyRepEmail;

    @Column(name = "company_rep_mobile", nullable = false)
    private String companyRepMobile;

    @JsonManagedReference
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "company_rep_city_id", referencedColumnName = "id")
    private LookupValue companyRepCity;

    @Column(name = "company_name", nullable = false)
    private String companyName;

    @Column(name = "company_company_website")
    private String companyWebsite;

    @Column(name = "company_company_email", nullable = false)
    private String companyEmail;

    @Column(name = "company_tax_number", nullable = false)
    private String companyTaxNumber;

    @Column(name = "company_commercial_registry", nullable = false)
    private String companyCommercialRegistry;

    @Column(name = "company_unified_national_number", nullable = false)
    private String companyUnifiedNationalNumber;

    @Column(name = "company_issue_date", nullable = false)
    private Timestamp companyIssueDate;

    @Column(name = "company_expiry_date", nullable = false)
    private Timestamp companyExpiryDate;

    @Column(name = "company_issue_date_hijri")
    private Timestamp companyIssueDateHijri;

    @Column(name = "company_expiry_date_hijri")
    private Timestamp companyExpiryDateHijri;

    @JsonManagedReference
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "company_sector_id", referencedColumnName = "id")
    private LookupValue companySector;

    @Column(name = "company_user_first_name", nullable = false)
    private String companyUserFirstName;

    @Column(name = "company_user_last_name", nullable = false)
    private String companyUserLastName;

    @Column(name = "company_user_national_id", nullable = false)
    private String companyUserNationalId;

    @Column(name = "company_user_username", nullable = false, unique = true)
    private String companyUserUsername;

    @Column(name = "company_user_email", nullable = false, unique = true)
    private String companyUserEmail;

    @Column(name = "company_user_contact_no", nullable = false)
    private String companyUserContactNo;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "agreed_to_terms_and_conditions", nullable = false)
    private Boolean agreedToTermsAndConditions;

    @JsonManagedReference
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "annual_package_id", referencedColumnName = "id", nullable = false)
    private Package annualPackage;

    @JsonManagedReference
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "service_package_id", referencedColumnName = "id")
    private Package servicePackage;

    @Column(name = "company_id")
    private Long companyId;

    @Column(name = "created_at", nullable = false)
    private Timestamp createdAt;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "updated_at", nullable = false)
    private Timestamp updatedAt;

    @Column(name = "updated_by")
    private String updated_by;

    @Column(name = "is_deleted", nullable = false)
    private Boolean isDeleted;

    @Column(name = "deleted_at")
    private Timestamp deletedAt;

    @Transient
    private List<AttachmentDTO> attachmentList;
}