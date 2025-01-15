package com.azm.apihub.backend.utilities.models;

import lombok.Data;

@Data
public class GoogleSheetFillRequest {
    private String sheetUrl;
    private Integer processRows;
    private Long accountId;
    private String sheetColumnAlphabet;
}
