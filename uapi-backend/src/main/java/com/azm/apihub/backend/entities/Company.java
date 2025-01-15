package com.azm.apihub.backend.entities;

import com.azm.apihub.backend.ApiHubUtils;
import com.azm.apihub.backend.attachments.models.AttachmentDTO;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Transient;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.TypeDef;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "api_hub_company" , schema = "apihub")
@TypeDef(name = "pgsql_enum", typeClass = PostgreSQLEnumType.class)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Company {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "company_name", nullable = false)
    private String companyName;

    @Column(name = "company_website")
    private String companyWebsite;

    @Column(name = "company_email")
    private String companyEmail;

    @Column(name = "tax_number")
    private String taxNumber;

    @Column(name = "commercial_registry")
    private String commercialRegistry;

    @Column(name = "unified_national_number")
    private String unifiedNationalNumber;
    
    @Column(name = "issue_date")
    private Timestamp issueDate;

    @Column(name = "expiry_date")
    private Timestamp expiryDate;

    @Column(name = "issue_date_hijri")
    private Timestamp issueDateHijri;

    @Column(name = "expiry_date_hijri")
    private Timestamp expiryDateHijri;

    @ManyToOne(cascade=CascadeType.ALL)
    @JoinColumn(name = "address_id")
    private Address address;

    @ManyToOne(cascade=CascadeType.ALL)
    @JoinColumn(name = "company_rep_id")
    private CompanyRep companyRep;

    @JsonBackReference
    @OneToMany(mappedBy = "company", fetch = FetchType.EAGER)
    private List<User> users = new ArrayList<>();


    @Column(name = "is_active", nullable = false)
    private Boolean isActive;

    @Column(name = "is_deleted", nullable = false)
    private Boolean isDeleted;

    @Column(name = "created_at", nullable = false)
    private Timestamp createdAt;

    @Column(name = "updated_at", nullable = false)
    private Timestamp updatedAt;

    @Column(name = "deleted_at")
    private Timestamp deletedAt;

    @Column(name = "allow_postpaid_packages")
    private Boolean allowPostpaidPackages;

    @Column(name = "services_postpaid_subscribed")
    private Boolean servicesPostpaidSubscribed;

    @Column(name = "services_postpaid_subscription_date")
    private Timestamp servicesPostpaidSubscriptionDate;

    @JsonBackReference
    @OneToMany(mappedBy = "company", fetch = FetchType.LAZY, cascade=CascadeType.ALL, orphanRemoval = true)
    private List<CompanyConfiguration> companyConfigurations = new ArrayList<>();

    @JsonBackReference
    @OneToMany(mappedBy = "company", fetch = FetchType.LAZY, cascade=CascadeType.ALL, orphanRemoval = true)
    private List<CompanyService> companyServices = new ArrayList<>();

    @JsonBackReference
    @OneToMany(mappedBy = "company", fetch = FetchType.LAZY, cascade=CascadeType.ALL, orphanRemoval = true)
    private List<AccountServiceHeadSubscription> accountServiceHeadSubscriptions = new ArrayList<>();

    @JsonBackReference
    @OneToMany(mappedBy = "company", fetch = FetchType.LAZY, cascade=CascadeType.ALL, orphanRemoval = true)
    private List<CompanyPackageAllowed> companyPackageAlloweds = new ArrayList<>();

    @JsonBackReference
    @OneToMany(mappedBy = "company", fetch = FetchType.LAZY, cascade=CascadeType.ALL, orphanRemoval = true)
    private List<CompanyServiceProviderLogging> companyServiceProviderLogs = new ArrayList<>();

    @JsonManagedReference
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "sector_id")
    private LookupValue sector;

    @Transient
    private List<AttachmentDTO> attachmentDTOList;

    @Column(name = "account_key")
    private String accountKey;

    @Column(name = "account_type", nullable = false)
    private String accountType;


    @Column(name = "main_account_id")
    private Long mainAccountId;

    @Column(name = "sub_account_type_desc")
    private String subAccountTypeDesc;

    @Column(name = "use_main_account_bundles")
    private Boolean useMainAccountBundles;

    @Transient
    public String getAccountCode() {
        return ApiHubUtils.getAccountCode(unifiedNationalNumber, id);
    }

    @Transient
    private User superAdmin;

    public String convertToJson() {
        JsonObjectBuilder jsonBuilder = Json.createObjectBuilder();

        addCommonFields(jsonBuilder);
        addAddress(jsonBuilder);
        addCompanyRep(jsonBuilder);
        addUsers(jsonBuilder);

        JsonObject jsonObject = jsonBuilder.build();
        return jsonObject.toString();
    }

    private void addCommonFields(JsonObjectBuilder jsonBuilder) {
        jsonBuilder.add("id", getId())
                .add("companyName", getCompanyName())
                .add("companyWebsite", getCompanyWebsite() != null ? getCompanyWebsite() : "")
                .add("companyEmail", getCompanyEmail() != null ? getCompanyEmail() : "")
                .add("taxNumber", getTaxNumber() != null ? getTaxNumber(): "")
                .add("commercialRegistry", getCommercialRegistry() != null ? getCommercialRegistry() : "")
                .add("unifiedNationalNumber", getUnifiedNationalNumber() != null ? getUnifiedNationalNumber() : "")
                .add("issueDate", getIssueDate() != null ? getIssueDate().toString() : "")
                .add("expiryDate", getExpiryDate() != null ? getExpiryDate().toString() : "")
                .add("isActive", getIsActive())
                .add("isDeleted", getIsDeleted())
                .add("deletedAt", getDeletedAt() != null ? getDeletedAt().toString() : "")
                .add("allowPostpaidPackages", getAllowPostpaidPackages())
                .add("servicesPostpaidSubscribed", getServicesPostpaidSubscribed())
                .add("servicesPostpaidSubscriptionDate", getServicesPostpaidSubscriptionDate() != null ? getServicesPostpaidSubscriptionDate().toString() : "")
                .add("sector", sector != null ? sector.getName() : "");
    }

    private void addAddress(JsonObjectBuilder jsonBuilder) {
        if (getAddress() != null) {
            Address address = getAddress();
            JsonObjectBuilder jsonAddressBuilder = Json.createObjectBuilder();
            jsonAddressBuilder.add("city", address.getCity() != null ? address.getCity().getName() : "")
                    .add("country", address.getCountry())
                    .add("district", address.getDistrict())
                    .add("buildingNumber", address.getBuildingNumber())
                    .add("postalCode", address.getPostalCode())
                    .add("secondaryNumber", address.getSecondaryNumber());

            jsonBuilder.add("address", jsonAddressBuilder);
        }
    }

    private void addCompanyRep(JsonObjectBuilder jsonBuilder) {
        if (getCompanyRep() != null) {
            CompanyRep companyRep = getCompanyRep();
            JsonObjectBuilder jsonCompanyRepBuilder = Json.createObjectBuilder();
            jsonCompanyRepBuilder.add("firstName", companyRep.getFirstName())
                    .add("lastName", companyRep.getLastName())
                    .add("nationalId", companyRep.getNationalId())
                    .add("email", companyRep.getEmail())
                    .add("mobile", companyRep.getMobile())
                    .add("city", companyRep.getCity() != null ? companyRep.getCity().getName() : "");

            jsonBuilder.add("companyRep", jsonCompanyRepBuilder);
        }
    }

    private void addUsers(JsonObjectBuilder jsonBuilder) {
        if (getUsers() != null && !getUsers().isEmpty()) {
            JsonArrayBuilder jsonUsersBuilder = Json.createArrayBuilder();

            for (User user : getUsers()) {
                JsonObjectBuilder companyUserBuilder = Json.createObjectBuilder();
                addUserFields(companyUserBuilder, user);
                jsonUsersBuilder.add(companyUserBuilder);
            }

            jsonBuilder.add("users", jsonUsersBuilder);
        }
    }

    private void addUserFields(JsonObjectBuilder companyUserBuilder, User user) {
        companyUserBuilder.add("firstName", user.getFirstName())
                .add("lastName", user.getLastName())
                .add("nationalId", user.getNationalId())
                .add("username", user.getUsername())
                .add("email", user.getEmail())
                .add("contactNo", user.getContactNo())
                .add("isSuperAdmin", user.getIsSuperAdmin())
                .add("isActive", user.getIsActive())
                .add("isDeleted", user.getIsDeleted())
                .add("deletedAt", user.getDeletedAt() != null ? user.getDeletedAt().toString() : "")
                .add("userType", user.getUserType() != null ? user.getUserType().name() : "")
                .add("role", user.getRole() != null ? user.getRole().getName() : "");
    }
}