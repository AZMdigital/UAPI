package com.azm.apihub.backend.utilities.services;

public interface UtilityService {

    public void processSheet(String sheetId, Integer processRows, String apiKey);

    public void fillSheetData(String sheetId, Integer processRows, Long accountId, String sheetColumnAlphabet);
}
