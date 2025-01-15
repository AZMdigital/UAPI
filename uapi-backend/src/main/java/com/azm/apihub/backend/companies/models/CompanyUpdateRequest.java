package com.azm.apihub.backend.companies.models;

import com.azm.apihub.backend.users.models.UserRequest;
import java.time.LocalDate;
import java.util.List;

import com.azm.apihub.backend.entities.CompanyAttachmentRequest;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CompanyUpdateRequest {
    String companyName;
    String companyWebsite;
    String companyEmail;
    Boolean isActive;
    String taxNumber;
    String commercialRegistry;
    String unifiedNationalNumber;
    LocalDate issueDate;
    LocalDate expiryDate;
    LocalDate issueDateHijri;
    LocalDate expiryDateHijri;
    Address address;
    CompanyRep companyRep;
    UserUpdatedRequest user;
    List<CompanyAttachmentRequest> companyAttachmentRequestList;
    Long sectorId;
    List<Long> services;
    List<Long> serviceProvidersForLogging;
    List<Long> allowedAnnualPackages;
    List<Long> allowedServicesPackages;
    Boolean allowPostpaidPackages;
    String subAccountDescription;
    Boolean useMainAccountBundles;
}