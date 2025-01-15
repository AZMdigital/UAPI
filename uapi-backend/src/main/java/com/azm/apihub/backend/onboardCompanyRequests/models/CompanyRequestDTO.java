package com.azm.apihub.backend.onboardCompanyRequests.models;

import com.azm.apihub.backend.entities.CompanyAttachmentRequest;
import java.time.LocalDate;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CompanyRequestDTO {
    private String companyName;
    private String companyWebsite;
    private String companyEmail;
    private String companyTaxNumber;
    private String companyCommercialRegistry;
    private String companyUnifiedNationalNumber;
    private LocalDate companyIssueDate;
    private LocalDate companyExpiryDate;
    private LocalDate companyIssueDateHijri;
    private LocalDate companyExpiryDateHijri;

    private String companyAddressBuildingNumber;
    private String companyAddressSecondaryNumber;
    private String companyAddressDistrict;
    private String companyAddressPostalCode;
    private String companyAddressCountry;
    private Long companyAddressCityId;

    private String companyRepFirstName;
    private String companyRepLastName;
    private String companyRepNationalId;
    private String companyRepEmail;
    private String companyRepMobile;
    private Long companyRepCityId;

    private String companyUserFirstName;
    private String companyUserLastName;
    private String companyUserNationalId;
    private String companyUserUsername;
    private String companyUserEmail;
    private String companyUserContactNo;

    List<CompanyAttachmentRequest> companyAttachmentRequestList;

    private Long companySectorId;
    private String status;
    private Boolean agreedToTermsAndConditions;
    private Long annualPackageId;
    private Long servicePackageId;
    private Long companyId;
}