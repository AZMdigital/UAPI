package com.azm.apihub.integrations.baseServices.dto;

import java.sql.Timestamp;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Company {

    private Long id;

    private String companyName;

    private String companyWebsite;

    private String companyEmail;

    private String taxNumber;

    private String commercialRegistry;

    private String unifiedNationalNumber;
    
    private Timestamp issueDate;

    private Timestamp expiryDate;

    private Timestamp issueDateHijri;

    private Timestamp expiryDateHijri;

    private Boolean isActive;

    private Boolean isDeleted;

    private Timestamp createdAt;

    private Timestamp updatedAt;

    private Timestamp deletedAt;

    private Boolean allowPostpaidPackages;

    private Boolean servicesPostpaidSubscribed;

    private String accountType;

    private Long mainAccountId;

    private String subAccountTypeDesc;

    private Boolean useMainAccountBundles;
}