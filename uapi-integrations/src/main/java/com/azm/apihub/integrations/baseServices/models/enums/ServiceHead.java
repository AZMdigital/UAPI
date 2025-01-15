package com.azm.apihub.integrations.baseServices.models.enums;

import lombok.Getter;

@Getter
public enum ServiceHead {
    SIMAH ("Simah"),

    WATHQ_REAL_ESTATE ("Real Estates Deeds"),
    WATHQ_ATTORNEY ("Power Of Attorney"),
    WATHQ_COMMERCIAL_REGISTRATION("Commercial Registration"),
    WATHQ_COMPANY_CONTRACTS("Article of Association"),

    WATHQ_NATIONAL_ADDRESS("National Address"),

    TCC_ADDRESS_BY_ID ("Address By ID"),
    TCC_MOBILE_NUMBER_VERIFICATION ("Mobile number verification"),
    TCC_FINGERPRINT_VERIFICATION ("Fingerprint verification"),
    TCC_NAFATH ("Nafath"),

    YAKEEN("Yakeen"),

    ETIMAD("Etimad"),
    MOFEED("Mofeed"),
    AKEED("Akeed"),
    SMS("UNIFONIC - SMS"),
    MSEGAT_SMS("MSEGAT - SMS"),
    SADAD("SADAD"),
    LEAN_OPEN_BANKING("Open Banking"),
    DEEWAN("DEEWAN - SMS"),
    DEEWAN_CONVERSATION("Deewan - Conversation"),
    CONTRACTS("Contracts.sa"),
    ABYAN("Abyan Comply"),
    NEOTEK_OPEN_BANKING("Neotek Open Banking");

    private final String value ;

    ServiceHead(String value){
        this.value = value;
    }

}