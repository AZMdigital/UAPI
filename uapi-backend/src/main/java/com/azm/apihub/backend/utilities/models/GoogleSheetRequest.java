package com.azm.apihub.backend.utilities.models;

import lombok.Data;

@Data
public class GoogleSheetRequest {
    private String sheetUrl;
    private Integer processRows;
}
