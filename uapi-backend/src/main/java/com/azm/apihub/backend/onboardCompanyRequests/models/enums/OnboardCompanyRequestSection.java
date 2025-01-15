package com.azm.apihub.backend.onboardCompanyRequests.models.enums;

public enum OnboardCompanyRequestSection {
    REGISTER_PAGE ("Register Page"),
    COMPANY_INFORMATION ("Company Information"),
    AUTHORIZED_AND_ADMIN_PE("Authorized and Admin Pe"),
    NATIONAL_ADDRESS("National Address"),
    ATTACHMENT("Attachment"),
    ANNUAL_TIERS("Annual Tiers"),
    SERVICE_PACKAGE("Service Package"),;

    private final String value;

    OnboardCompanyRequestSection(String value){
            this.value = value;
        }
        public String getValue(){
            return value;
        }
}