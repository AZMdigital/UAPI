package com.azm.apihub.backend.utilities.models;

import lombok.Data;

@Data
public class SheetRequestObject {
    private String deedNumber;
    private String idNumber;
    private String idType;
    private String ownerName;
    private String deedStatus;
    private String deedCity;
    private String districtName;
    private String landNumber;
    private String planNumber;
    private String deedArea;
    private String northLimitDescription;
    private String northLimitLength;
    private String southLimitDescription;
    private String southLimitLength;
    private String eastLimitDescription;
    private String eastLimitLength;
    private String westLimitDescription;
    private String westLimitLength;
    private String deedDate;
}
