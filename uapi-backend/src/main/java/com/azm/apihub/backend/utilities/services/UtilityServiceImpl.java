package com.azm.apihub.backend.utilities.services;

import com.azm.apihub.backend.entities.integrationLogs.IntegrationLogs;
import com.azm.apihub.backend.exceptions.BadRequestException;
import com.azm.apihub.backend.utilities.configurations.GoogleSheetCredentialsConfig;
import com.azm.apihub.backend.utilities.models.MongoResponseBody;
import com.azm.apihub.backend.utilities.models.SheetRequestObject;
import com.azm.apihub.backend.utilities.models.deed.*;
import com.azm.apihub.backend.utilities.repository.IntegrationLogsRepository;
import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.sheets.v4.Sheets;
import com.google.api.services.sheets.v4.SheetsScopes;
import com.google.api.services.sheets.v4.model.ValueRange;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.*;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;


@Slf4j
@Service
public class UtilityServiceImpl implements UtilityService {

    @Autowired
    private IntegrationService integrationService;

    @Autowired
    private IntegrationLogsRepository integrationLogsRepository;

    @Override
    public void processSheet(String sheetId, Integer processRows, String apiKey) {
        ValueRange response = getSheetDataValues(sheetId).getFirst();
        Sheets sheets = getSheetDataValues(sheetId).getSecond();

        List<List<Object>> values = response.getValues();
        if (values == null || values.isEmpty()) {
            log.info("No data found in the provided sheet");
        } else {
            readSheetData(values, processRows, sheetId, sheets, apiKey);
        }
    }

    private Pair<ValueRange, Sheets> getSheetDataValues(String sheetId) {
        ValueRange response = null;
        Sheets sheets = null;
        try {
            InputStream credentialsStream = GoogleSheetCredentialsConfig.class.getResourceAsStream("/google-credentials/uapi-integration-credentials.json");
            if (credentialsStream == null) {
                throw new FileNotFoundException("Credential file not found in resources: ");
            }
            GoogleCredential credential = GoogleCredential.fromStream(credentialsStream)
                    .createScoped(Collections.singleton(SheetsScopes.SPREADSHEETS));
            sheets = new Sheets.Builder(
                    GoogleNetHttpTransport.newTrustedTransport(),
                    GsonFactory.getDefaultInstance(), credential)
                    .setApplicationName("UAPI-Integration")
                    .build();

            String range = "Sheet1!A:U"; //Read A to U columns
            response = sheets.spreadsheets().values()
                    .get(sheetId, range)
                    .execute();

            return Pair.of(response, sheets);
        } catch (Exception e) {
            throw new BadRequestException("Cannot parse the provided sheet"+e.getMessage());
        }
    }

    private void readSheetData(List<List<Object>> sheetData, Integer processRows, String sheetId, Sheets sheets, String apiKey) {
        if(processRows == null)
            processRows = sheetData.size();

        log.info("Sheet row count: {}", processRows);
        for (int row = 1; row < processRows+1; row++) {
            List<Object> rowData = sheetData.get(row);
            var isValidRowSize = rowData.stream().filter(obj -> !obj.equals("")).toList().size();
            if (isValidRowSize < 3) {
                writeDataOnSheet("Row data is not complete, skipped processing for this row", sheetId, row + 1, sheets);
                continue;
            }

            if(rowData.size() == 6) { // this is to check if row data is not already filled
                String deedNumber = rowData.get(0).toString();
                String idNumber = rowData.get(1).toString();
                String idType = rowData.get(2).toString();
                log.info(String.format("%d: %s, %s %s \n", row, deedNumber, idNumber, idType));
                //Call Actual integration deed service to get deed data
                callIntegrationDeedService(deedNumber, idNumber, idType, apiKey, sheetId, row, sheets);
            }
        }
    }

    @Override
    public void fillSheetData(String sheetId, Integer processRows, Long accountId, String sheetColumnAlphabet) {
        ValueRange response = getSheetDataValues(sheetId).getFirst();
        Sheets sheets = getSheetDataValues(sheetId).getSecond();

        List<List<Object>> values = response.getValues();
        if (values == null || values.isEmpty()) {
            log.info("No data found in the sheet");
        } else {
            readAndFillSheetDataToSpecificColumn(values, processRows, sheetId, sheets, accountId, sheetColumnAlphabet);
        }
    }

    private void readAndFillSheetDataToSpecificColumn(List<List<Object>> sheetData, Integer processRows, String sheetId,
                                                      Sheets sheets, Long accountId, String sheetColumnAlphabet) {
        if(processRows == null)
            processRows = sheetData.size();
        else
            processRows += 1;

        log.info("Filling Sheet row count: {}", processRows);
        for (int row = 1; row < processRows; row++) {
            List<Object> rowData = sheetData.get(row);
            var isValidRowSize = rowData.stream().filter(obj -> !obj.equals("")).toList().size();
            if (isValidRowSize < 3) {
                writeDataOnSheet("Row data is not complete, skipped processing for this row", sheetId, row + 1, sheets);
                continue;
            }

            if(rowData.size() > 15 && rowData.size() < 21) { // this is to check if row data is not already filled
                String deedNumber = rowData.get(0).toString();
                log.info(String.format("%d: %s", row + 1, deedNumber));

                Optional<IntegrationLogs> integrationLog = integrationLogsRepository.findAllByAccountIdAndServiceAndResponseBodyDeedDetailsDeedNumber(
                        accountId, "Real Estates Deeds", deedNumber).stream().findFirst();

                if(integrationLog.isPresent()) {
                    MongoResponseBody bodyMap = integrationLog.get().getResponse().getBody();
                    if(bodyMap != null && bodyMap.getDeedDetails() != null) {
                        DeedDetails deedDetails = bodyMap.getDeedDetails();

                        String deedNumberFromDb = deedDetails.getDeedNumber();
                        String deedDate = deedDetails.getDeedDate();
                        if (deedNumber.equals(deedNumberFromDb)) {
                            String range = String.format("Sheet1!%s%d", sheetColumnAlphabet, row + 1);

                            List<List<Object>> values = new ArrayList<>();
                            List<Object> valueRow = new ArrayList<>();
                            valueRow.add(deedDate);
                            values.add(valueRow);

                            ValueRange body = new ValueRange().setValues(values);

                            log.info("Writing deed date on column {}: row: {} \n", sheetColumnAlphabet, row + 1);
                            executeWriteRequestOnSheet(sheets, sheetId, range, body);
                        }
                    }
                };
            }
        }
    }

    private void callIntegrationDeedService(String deedNumber, String idNumber, String idType,
                                            String apiKey, String sheetId, int rowNumber, Sheets sheets) {
        Object object = integrationService.getDeedInfo(deedNumber, idNumber, idType, apiKey);

        log.info("Writing deedNumber: {} and idNumber: {}", deedNumber, idNumber);
        if(object instanceof DeedSuccessResponse) {
            SheetRequestObject sheetRequestObject = composeSheetData((DeedSuccessResponse) object, idType);
            writeDataOnSheet(sheetRequestObject, sheetId, rowNumber + 1, sheets);
        } else {
            writeDataOnSheet((String) object, sheetId, rowNumber + 1, sheets);
        }
    }

    private SheetRequestObject composeSheetData(DeedSuccessResponse deedSuccessResponse, String idType) {
        SheetRequestObject sheetRequestObject = new SheetRequestObject();

        Optional.ofNullable(deedSuccessResponse)
                .map(DeedSuccessResponse::getDeedDetails)
                .ifPresent(deedDetails -> sheetRequestObject.setDeedNumber(deedDetails.getDeedNumber()));

        Optional.ofNullable(deedSuccessResponse)
                .map(DeedSuccessResponse::getDeedDetails)
                .ifPresent(deedDetails -> sheetRequestObject.setDeedDate(deedDetails.getDeedDate()));

        Optional.ofNullable(deedSuccessResponse)
                .map(DeedSuccessResponse::getOwnerDetails)
                .filter(ownerDetails -> !ownerDetails.isEmpty())
                .ifPresent(ownerDetails -> {
                    String idNumbers = ownerDetails.stream()
                            .map(OwnerDetails::getIdNumber)
                            .collect(Collectors.joining(", "));
                    sheetRequestObject.setIdNumber(idNumbers);

                    String ownerNames = ownerDetails.stream()
                            .map(OwnerDetails::getOwnerName)
                            .collect(Collectors.joining(", "));
                    sheetRequestObject.setOwnerName(ownerNames);
                });

        sheetRequestObject.setIdType(idType);

        Optional.ofNullable(deedSuccessResponse)
                .map(DeedSuccessResponse::getDeedStatus)
                .ifPresent(sheetRequestObject::setDeedStatus);

        Optional.ofNullable(deedSuccessResponse)
                .map(DeedSuccessResponse::getCourtDetails)
                .map(CourtDetails::getDeedCity)
                .ifPresent(sheetRequestObject::setDeedCity);

        Optional.ofNullable(deedSuccessResponse)
                .map(DeedSuccessResponse::getRealEstateDetails)
                .filter(realEstateDetails -> !realEstateDetails.isEmpty())
                .ifPresent(realEstateDetails -> {
                    String districtNames = realEstateDetails.stream()
                            .map(RealEstateDetails::getDistrictName)
                            .collect(Collectors.joining(", "));
                    sheetRequestObject.setDistrictName(districtNames);

                    String landNumbers = realEstateDetails.stream()
                            .map(RealEstateDetails::getLandNumber)
                            .collect(Collectors.joining(", "));
                    sheetRequestObject.setLandNumber(landNumbers);

                    String planNumbers = realEstateDetails.stream()
                            .map(RealEstateDetails::getPlanNumber)
                            .collect(Collectors.joining(", "));
                    sheetRequestObject.setPlanNumber(planNumbers);
                });

        Optional.ofNullable(deedSuccessResponse)
                .map(DeedSuccessResponse::getDeedInfo)
                .map(DeedInfo::getDeedArea)
                .map(Object::toString)
                .ifPresent(sheetRequestObject::setDeedArea);

        Optional.ofNullable(deedSuccessResponse)
                .map(DeedSuccessResponse::getDeedLimitsDetails)
                .ifPresent(deedLimitsDetails -> {
                    sheetRequestObject.setNorthLimitDescription(deedLimitsDetails.getNorthLimitDescription());
                    sheetRequestObject.setNorthLimitLength(Optional.ofNullable(deedLimitsDetails.getNorthLimitLength()).map(Object::toString).orElse(""));
                    sheetRequestObject.setSouthLimitDescription(deedLimitsDetails.getSouthLimitDescription());
                    sheetRequestObject.setSouthLimitLength(Optional.ofNullable(deedLimitsDetails.getSouthLimitLength()).map(Object::toString).orElse(""));
                    sheetRequestObject.setEastLimitDescription(deedLimitsDetails.getEastLimitDescription());
                    sheetRequestObject.setEastLimitLength(Optional.ofNullable(deedLimitsDetails.getEastLimitLength()).map(Object::toString).orElse(""));
                    sheetRequestObject.setWestLimitDescription(deedLimitsDetails.getWestLimitDescription());
                    sheetRequestObject.setWestLimitLength(Optional.ofNullable(deedLimitsDetails.getWestLimitLength()).map(Object::toString).orElse(""));
                });

        return sheetRequestObject;
    }

    private void writeDataOnSheet(SheetRequestObject sheetRequestObject, String sheetId, int rowNumber, Sheets sheets) {
        List<List<Object>> values = new ArrayList<>();
        values.add(Arrays.asList(
                sheetRequestObject.getDeedNumber(),
                sheetRequestObject.getIdNumber(),
                sheetRequestObject.getIdType(),
                "RIYADH",
                "اجارة بدل سكن",
                sheetRequestObject.getOwnerName(),
                sheetRequestObject.getDeedStatus(),
                sheetRequestObject.getDeedCity(),
                sheetRequestObject.getDistrictName(),
                sheetRequestObject.getLandNumber(),
                sheetRequestObject.getPlanNumber(),
                sheetRequestObject.getDeedArea(),
                sheetRequestObject.getNorthLimitDescription(),
                sheetRequestObject.getNorthLimitLength(),
                sheetRequestObject.getSouthLimitDescription(),
                sheetRequestObject.getSouthLimitLength(),
                sheetRequestObject.getEastLimitDescription(),
                sheetRequestObject.getEastLimitLength(),
                sheetRequestObject.getWestLimitDescription(),
                sheetRequestObject.getWestLimitLength(),
                sheetRequestObject.getDeedDate(),
                ""
        ));

        String range = "Sheet1!A"+rowNumber+":V"+rowNumber;
        ValueRange body = new ValueRange().setValues(values);

        executeWriteRequestOnSheet(sheets, sheetId, range, body);
    }

    private void writeDataOnSheet(String error, String sheetId, int rowNumber, Sheets sheets) {
        List<List<Object>> values = new ArrayList<>();
        values.add(List.of(error));

        String range = "Sheet1!V"+rowNumber;
        ValueRange body = new ValueRange().setValues(values);

        executeWriteRequestOnSheet(sheets, sheetId, range, body);
    }

    private void executeWriteRequestOnSheet(Sheets sheets, String sheetId, String range, ValueRange body) {
        try {
            sheets.spreadsheets().values()
                    .update(sheetId, range, body)
                    .setValueInputOption("RAW")
                    .execute();

            // Added 600ms wait for Google api limit threshold
            try {
                log.info("Sleeping for 3 seconds");
                Thread.sleep(1500);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
        } catch (IOException e) {
            throw new BadRequestException("Cannot write data on sheet: "+e.getMessage());
        }
    }
}
