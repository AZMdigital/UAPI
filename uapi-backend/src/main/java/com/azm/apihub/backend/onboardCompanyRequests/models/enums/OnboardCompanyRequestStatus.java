package com.azm.apihub.backend.onboardCompanyRequests.models.enums;

public enum OnboardCompanyRequestStatus {
    DRAFT ("Draft"),
    SUBMITTED ("Submitted"),
    APPROVED ("Approved"),
    REJECTED ("Rejected"),
    INCOMPLETE ("Incomplete"),
    COMPLETED ("Completed");

    private final String value;

    OnboardCompanyRequestStatus(String value){
        this.value = value;
    }

    public String getValue(){
        return value;
    }
}