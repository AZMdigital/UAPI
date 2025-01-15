package com.azm.apihub.integrations.baseServices;

import com.azm.apihub.integrations.baseServices.dto.CompanyConfiguration;
import com.azm.apihub.integrations.baseServices.dto.PublicKey;
import com.azm.apihub.integrations.baseServices.models.CompanyCallbackConfig;
import com.azm.apihub.integrations.baseServices.models.ServiceCallback;
import com.azm.apihub.integrations.callbackLogs.services.CallbackLogsService;
import com.azm.apihub.integrations.configuration.dto.CompanyDetails;
import com.azm.apihub.integrations.contracts.exception.ContractsErrorResponse;
import com.azm.apihub.integrations.contracts.exception.ContractsException;
import com.azm.apihub.integrations.edaat.exception.EdaatErrorDetails;
import com.azm.apihub.integrations.edaat.exception.EdaatException;
import com.azm.apihub.integrations.etimad.exceptions.EtimadException;
import com.azm.apihub.integrations.etimad.exceptions.ErrorResponse;
import com.azm.apihub.integrations.exceptions.BadRequestException;
import com.azm.apihub.integrations.baseServices.models.ServiceCredentials;
import com.azm.apihub.integrations.baseServices.models.enums.ServiceHead;
import com.azm.apihub.integrations.masdr.mofeed.exceptions.MofeedErrorDetail;
import com.azm.apihub.integrations.masdr.mofeed.exceptions.MofeedException;
import com.azm.apihub.integrations.msegat.exception.MsegatErrorDetails;
import com.azm.apihub.integrations.msegat.exception.MsegatException;
import com.azm.apihub.integrations.neotek.exception.NeotekError;
import com.azm.apihub.integrations.neotek.exception.NeotekException;
import com.azm.apihub.integrations.tcc.exception.NafathError;
import com.azm.apihub.integrations.tcc.exception.NafathException;
import com.azm.apihub.integrations.unifonic.exception.UnifonicErrorDetails;
import com.azm.apihub.integrations.unifonic.exception.UnifonicException;
import com.azm.apihub.integrations.utils.IntegrationConstants;
import com.azm.apihub.integrations.utils.IntegrationUtils;
import com.azm.apihub.integrations.wathq.exception.Error;
import com.azm.apihub.integrations.wathq.exception.WathqException;
import com.azm.apihub.integrations.wathq.realestate.services.WathqRealEstateServiceImpl;
import com.azm.apihub.integrations.yakeen.exception.YakeenError;
import com.azm.apihub.integrations.yakeen.exception.YakeenException;
import com.google.gson.Gson;
import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.lang.reflect.Type;
import java.util.Base64;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

@Slf4j
@Service
public class BaseService {

    @Autowired
    private BackendService backendService;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private CallbackLogsService callbackLogsService;

    @Autowired
    private RestTemplate insecureRestTemplate;

    private final ExecutorService executorService = Executors.newSingleThreadExecutor();

    protected @Value("${integration.tcc.nafath.retry-callback-count}") int retryCallbackCount;

    protected CompanyConfiguration getCompanyConfiguration(String configName) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CompanyDetails companyDetails = (CompanyDetails) authentication.getPrincipal();
        CompanyConfiguration companyConfiguration;
        try {
            companyConfiguration = backendService.getCompanyConfiguration(companyDetails.getCompany().getId(), configName);
        } catch (HttpClientErrorException exception) {
            if (HttpStatus.NOT_FOUND == exception.getStatusCode()) {
                throw new BadRequestException("Company configuration is not configured. Please add configuration for this company before calling this service");
            }
            throw exception;
        }
        return companyConfiguration;
    }

    protected com.azm.apihub.integrations.baseServices.models.Service getServiceInfo(String serviceUri) {
        List<com.azm.apihub.integrations.baseServices.models.Service> services = backendService.getServiceInfo(serviceUri);

        if (services != null && !services.isEmpty())
            return services.get(0);
        else
            throw new BadRequestException("Service does not exists");
    }

    protected CompanyDetails getCompanyDetails() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (CompanyDetails) authentication.getPrincipal();
    }

    protected ServiceCallback getServiceCallbackDetailsByTransaction(String transactionId) {
        return backendService.getServiceCallbackByTransactionId(transactionId);
    }

    protected CompanyCallbackConfig getCallbackConfigDetails(Long companyId, Long serviceId) {
        return backendService.getServiceCallbackConfig(companyId, serviceId);
    }

    protected void addServiceCallbackTransaction(Long companyId, Long serviceId, String transactionId) {
        backendService.addCallbackTransaction(companyId, serviceId, transactionId);
    }

    protected void updateServiceCallbackTransaction(String transactionId) {
        backendService.updateCallbackTransaction(transactionId);
    }

    protected PublicKey getPublicKey() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CompanyDetails companyDetails = (CompanyDetails) authentication.getPrincipal();
        PublicKey publicKey;
        try {
            publicKey = backendService.getPublicKeyInfo(companyDetails.getCompany().getId());
        } catch (HttpClientErrorException exception) {
            if (HttpStatus.NOT_FOUND == exception.getStatusCode()) {
                throw new BadRequestException("Client Public key is not configured. Please add public key before calling this service");
            }
            throw exception;
        }
        return publicKey;
    }

    protected ServiceCredentials getServiceCredentials(ServiceHead serviceHead) {
        return backendService.getServiceCredentials(serviceHead.getValue());
    }

    protected <T, R> R callIntegrationApi(String url, Type responseType, ServiceHead serviceHead) {
        return callIntegrationApi(url, HttpMethod.GET, responseType, serviceHead, null, true);
    }

    protected <T, R> R callIntegrationApiWithUrlEncodedFormData(String url, HttpMethod method, Type responseType, ServiceHead serviceHead, MultiValueMap<String, String> formData) {
        Gson gson = new Gson();
        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(formData, headers);

        return makeRestCall(serviceHead, url, entity, method, responseType, true);
    }

    protected <T, R> R callIntegrationApi(String url, HttpMethod method, Type responseType, ServiceHead serviceHead,
                                          T requestBody, boolean addApiKeyToHeader) {
        Gson gson = new Gson();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        ServiceCredentials serviceCredentials = null;

        if (serviceHead == ServiceHead.SMS || serviceHead == ServiceHead.SADAD) {
            headers.setAccept(List.of(MediaType.APPLICATION_JSON));
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        } else if (serviceHead == ServiceHead.DEEWAN) {
            headers.setAccept(List.of(MediaType.APPLICATION_JSON));
        } else {
            if (serviceHead == ServiceHead.ETIMAD)
                headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            serviceCredentials = getServiceCredentials(serviceHead);
        }

        if (addApiKeyToHeader && serviceCredentials != null) {
            if (serviceCredentials.getServiceAuthType().getAuthType().getName().equals(IntegrationConstants.HeaderConstants.CREDENTIALS_WITH_APP_SECRETS)) {
                headers.set(IntegrationConstants.HeaderConstants.APP_ID, serviceCredentials.getAppId());
                headers.set(IntegrationConstants.HeaderConstants.APP_KEY, serviceCredentials.getApiKey());
                headers.set(IntegrationConstants.HeaderConstants.USERNAME, serviceCredentials.getUsername());
                headers.set(IntegrationConstants.HeaderConstants.PASSWORD, serviceCredentials.getPassword());
            } else if (serviceCredentials.getServiceAuthType().getAuthType().getName().equals(IntegrationConstants.HeaderConstants.BASIC_CREDENTIALS)) {
                String auth = serviceCredentials.getUsername() + ":" + serviceCredentials.getPassword();
                byte[] encodedAuth = Base64.getEncoder().encode(auth.getBytes());
                String authHeader = "Basic " + new String(encodedAuth);

                headers.set(IntegrationConstants.HeaderConstants.AUTHORIZATION, authHeader);
            } else if(serviceCredentials.getServiceAuthType().getAuthType().getName().equals(IntegrationConstants.HeaderConstants.BEARER_TOKEN)) {
                headers.set(IntegrationConstants.HeaderConstants.AUTHORIZATION, "Bearer " + serviceCredentials.getToken());
            } else if(serviceHead == ServiceHead.ABYAN)
                headers.set("API-Key", serviceCredentials.getApiKey());
            else
                headers.set(IntegrationConstants.HeaderConstants.API_KEY, serviceCredentials.getApiKey());
        }

//        if(requestBody instanceof MultiValueMap) {
//            HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>((MultiValueMap<String, String>) requestBody, headers);
//            return makeRestCall(serviceHead, url, entity, method, responseType, false);
//        } else {
//            HttpEntity<String> entity = new HttpEntity<>(gson.toJson(requestBody), headers);
//            return makeRestCall(serviceHead, url, entity, method, responseType, false);
//        }

        if(requestBody instanceof MultiValueMap) {
            HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>((MultiValueMap<String, String>) requestBody, headers);

            if(serviceHead == ServiceHead.TCC_MOBILE_NUMBER_VERIFICATION
                    || serviceHead == ServiceHead.TCC_ADDRESS_BY_ID
                    || serviceHead == ServiceHead.TCC_FINGERPRINT_VERIFICATION)
                return makeInSecureRestCall(serviceHead, url, entity, method, responseType, false);
            else
                return makeRestCall(serviceHead, url, entity, method, responseType, false);
        } else {
            HttpEntity<String> entity = new HttpEntity<>(gson.toJson(requestBody), headers);

            if(serviceHead == ServiceHead.TCC_MOBILE_NUMBER_VERIFICATION
                    || serviceHead == ServiceHead.TCC_ADDRESS_BY_ID
                    || serviceHead == ServiceHead.TCC_FINGERPRINT_VERIFICATION)
                return makeInSecureRestCall(serviceHead, url, entity, method, responseType, false);
            else
                return makeRestCall(serviceHead, url, entity, method, responseType, false);
        }
    }

    protected <T, R> R callIntegrationApi(String url, HttpMethod httpMethod, Type responseType, ServiceHead serviceHead, HttpHeaders headers, T requestBody) {
        Gson gson = new Gson();

        headers.setContentType(MediaType.APPLICATION_JSON);

        if (serviceHead == ServiceHead.YAKEEN) {
            var serviceCredentials = getServiceCredentials(serviceHead);
            headers.set(IntegrationConstants.HeaderConstants.APP_ID, serviceCredentials.getAppId());
            headers.set(IntegrationConstants.HeaderConstants.APP_KEY, serviceCredentials.getApiKey());
        }

        HttpEntity<String> entity;
        if (requestBody != null)
            entity = new HttpEntity<>(gson.toJson(requestBody), headers);
        else
            entity = new HttpEntity<>(null, headers);

        return makeRestCall(serviceHead, url, entity, httpMethod, responseType, false);
    }

    private void parseHttpClientException(HttpClientErrorException httpClientErrorException, ServiceHead serviceHead, Gson gson) {
        log.error(httpClientErrorException.getMessage());
        String errorBody = httpClientErrorException.getResponseBodyAsString().isBlank() ? httpClientErrorException.getStatusText() : httpClientErrorException.getResponseBodyAsString();

        try {
            if (serviceHead == ServiceHead.YAKEEN) {
                YakeenError yakeenError = gson.fromJson(errorBody, YakeenError.class);
                throw new YakeenException(httpClientErrorException.getStatusCode(),
                        yakeenError.getErrorDetail().getErrorMessage().isBlank() ? yakeenError.getErrorDetail().getErrorTitle() : yakeenError.getErrorDetail().getErrorMessage(),
                        yakeenError);
            } else if (serviceHead == ServiceHead.ETIMAD) {
                ErrorResponse etimadError = gson.fromJson(errorBody, ErrorResponse.class);
                if (etimadError.getErrors() != null && !etimadError.getErrors().isEmpty()) {
                    throw new EtimadException(httpClientErrorException.getStatusCode(), etimadError.getErrors().get(0).getDetail(), etimadError);
                } else {
                    throw new HttpClientErrorException(httpClientErrorException.getStatusCode(), errorBody);
                }
            } else if (serviceHead == ServiceHead.MOFEED) {
                MofeedErrorDetail mofeedError = gson.fromJson(errorBody, MofeedErrorDetail.class);
                throw new MofeedException(httpClientErrorException.getStatusCode(), mofeedError.getErrorText(), mofeedError);
            } else if (serviceHead == ServiceHead.TCC_NAFATH) {
                NafathError nafathError = gson.fromJson(errorBody, NafathError.class);
                throw new NafathException(httpClientErrorException.getStatusCode(), nafathError.getMessage(), nafathError);
            } else if (serviceHead == ServiceHead.SMS) {
                UnifonicErrorDetails unifonicErrorDetails = gson.fromJson(errorBody, UnifonicErrorDetails.class);
                throw new UnifonicException(httpClientErrorException.getStatusCode(), unifonicErrorDetails.getMessage(), unifonicErrorDetails);
            } else if (serviceHead == ServiceHead.MSEGAT_SMS) {
                MsegatErrorDetails msegatErrorDetails = gson.fromJson(errorBody, MsegatErrorDetails.class);
                throw new MsegatException(httpClientErrorException.getStatusCode(), msegatErrorDetails.getMessage(), msegatErrorDetails);
            } else if (serviceHead == ServiceHead.SADAD) {
                EdaatErrorDetails edaatErrorDetails = gson.fromJson(errorBody, EdaatErrorDetails.class);
                throw new EdaatException(httpClientErrorException.getStatusCode(), edaatErrorDetails.getError(), edaatErrorDetails);
            } else if (serviceHead == ServiceHead.CONTRACTS) {
                ContractsErrorResponse contractsErrorResponse = gson.fromJson(errorBody, ContractsErrorResponse.class);
                throw new ContractsException(httpClientErrorException.getStatusCode(), contractsErrorResponse.getTitle(), contractsErrorResponse);
            } else if (serviceHead == ServiceHead.WATHQ_COMMERCIAL_REGISTRATION || serviceHead == ServiceHead.WATHQ_ATTORNEY
                    || serviceHead == ServiceHead.WATHQ_NATIONAL_ADDRESS || serviceHead == ServiceHead.WATHQ_COMPANY_CONTRACTS
                    || serviceHead == ServiceHead.WATHQ_REAL_ESTATE) {
                Error errorResponse = gson.fromJson(errorBody, Error.class);
                throw new WathqException(httpClientErrorException.getStatusCode(), errorResponse.getCode(), errorResponse.getMessage());
            } else if (serviceHead == ServiceHead.NEOTEK_OPEN_BANKING) {
                NeotekError neotekError = gson.fromJson(errorBody, NeotekError.class);
                String errorMessage = "Error from Neotek";
                if (Objects.nonNull(neotekError) && Objects.nonNull(neotekError.getErrors()) && !neotekError.getErrors().isEmpty())
                    errorMessage = neotekError.getErrors().get(0).getMessage();
                throw new NeotekException(httpClientErrorException.getStatusCode(), errorMessage, neotekError);
            } else {
                throw new HttpClientErrorException(httpClientErrorException.getStatusCode(), errorBody);
            }
        } catch (Exception exception) {
            throw new HttpClientErrorException(httpClientErrorException.getStatusCode(), errorBody);
        }
    }

    private <T, R> R makeRestCall(ServiceHead serviceHead, String url, HttpEntity<T> entity, HttpMethod httpMethod, Type responseType, boolean parseErrorDetail) {
        Gson gson = new Gson();
        try {
            log.info("Calling {} API: {} ", serviceHead.getValue(), url);
            log.info("Curl: {}", IntegrationUtils.generateCurl(url, entity.getHeaders(), httpMethod, String.valueOf(entity.getBody())));
            ResponseEntity<String> responseEntity = restTemplate.exchange(url, httpMethod, entity, String.class);

            if (parseErrorDetail) {
                if (responseEntity.getBody() != null && (responseEntity.getBody().contains("error") || responseEntity.getBody().contains("error_description"))) {
                    EdaatErrorDetails edaatErrorDetails = gson.fromJson(responseEntity.getBody(), EdaatErrorDetails.class);
                    throw new EdaatException(responseEntity.getStatusCode(), edaatErrorDetails.getError(), edaatErrorDetails);
                }
            }
            log.info("API Response Full: {}", responseEntity);
            log.info("API Response Code: {}", responseEntity.getStatusCode());
            log.info("API Response body: {}", responseEntity.getBody());
            return gson.fromJson(responseEntity.getBody(), responseType);
        } catch (HttpClientErrorException httpClientErrorException) {
            parseHttpClientException(httpClientErrorException, serviceHead, gson);
            return null;
        }
    }

    private <T, R> R makeInSecureRestCall(ServiceHead serviceHead, String url, HttpEntity<T> entity, HttpMethod httpMethod, Type responseType, boolean parseErrorDetail) {
        Gson gson = new Gson();
        try {
            log.info("Calling Insecure {} API: {} ", serviceHead.getValue(), url);
            log.info("Curl-Insecure: {}", IntegrationUtils.generateCurl(url, entity.getHeaders(), httpMethod, String.valueOf(entity.getBody())));

            ResponseEntity<String> responseEntity = insecureRestTemplate.exchange(url, httpMethod, entity, String.class);

            if (parseErrorDetail) {
                if (responseEntity.getBody() != null && (responseEntity.getBody().contains("error") || responseEntity.getBody().contains("error_description"))) {
                    EdaatErrorDetails edaatErrorDetails = gson.fromJson(responseEntity.getBody(), EdaatErrorDetails.class);
                    throw new EdaatException(responseEntity.getStatusCode(), edaatErrorDetails.getError(), edaatErrorDetails);
                }
            }
            return gson.fromJson(responseEntity.getBody(), responseType);
        } catch (HttpClientErrorException httpClientErrorException) {
            parseHttpClientException(httpClientErrorException, serviceHead, gson);
            return null;
        }
    }

    protected <T> T parseDummyResponse(String serviceJsonPath, Type type) {
        String responseJson = "";
        InputStream is = WathqRealEstateServiceImpl.class.getResourceAsStream("/mock/" + serviceJsonPath);
        if (is != null) {
            BufferedReader reader = new BufferedReader(new InputStreamReader(is));
            responseJson = reader.lines().collect(Collectors.joining(System.lineSeparator()));
        }

        log.info("Parsing dummy service response " + serviceJsonPath + ":\n" + responseJson);

        Gson gson = new Gson();

        // Parse as a single object
        return gson.fromJson(responseJson, type);
    }

    protected String parseMockResponse(String serviceJsonPath) {
        String responseJson = "";
        InputStream is = WathqRealEstateServiceImpl.class.getResourceAsStream("/mock/" + serviceJsonPath);
        if (is != null) {
            BufferedReader reader = new BufferedReader(new InputStreamReader(is));
            responseJson = reader.lines().collect(Collectors.joining(System.lineSeparator()));
        } else
            throw new BadRequestException("Mock Response is not configured, Please configure mock response for this service");

        log.debug("Parsing mock service response " + serviceJsonPath + ":\n" + responseJson);

        return responseJson;
    }

    protected String convertToJSON(Object object) {
        return new Gson().toJson(object);
    }

    protected void parseAndSendCallbackToClient(UUID requestId, String transactionId, Object requestData) {
        ServiceCallback callbackServiceDetails = getServiceCallbackDetailsByTransaction(transactionId);
        if(callbackServiceDetails != null) {
            CompanyCallbackConfig companyCallbackConfig = getCallbackConfigDetails(callbackServiceDetails.getCompanyId(), callbackServiceDetails.getServiceId());
            if(companyCallbackConfig != null) {
                if(companyCallbackConfig.getIsActive()) {
                    callbackLogsService.saveOutboundCallbackLogs(requestId.toString(), companyCallbackConfig.getCallbackUrl(),
                            convertToJSON(requestData), companyCallbackConfig.getCompanyId(),
                            companyCallbackConfig.getServiceId(), callbackServiceDetails.getId());

                    sendCallbackToClient(requestId.toString(), companyCallbackConfig.getCallbackUrl(),
                            companyCallbackConfig.getAuthHeaderKey(), companyCallbackConfig.getAuthHeaderValue(), requestData);

                    updateServiceCallbackTransaction(transactionId);
                } else {
                    callbackLogsService.saveOutboundCallbackLogsError(requestId.toString(), "Callback configuration is inactive");
                    log.error("Callback configuration is inactive");
                }
            } else {
                callbackLogsService.saveOutboundCallbackLogsError(requestId.toString(), "No Callback configuration found, Please add configuration first");
                log.error("No Callback configuration found, Please add configuration first");
            }
        } else {
            callbackLogsService.saveOutboundCallbackLogsError(requestId.toString(), "No callback transaction detail found");
            log.error("No callback transaction detail found");
        }
    }

    private void sendCallbackToClient(String requestId, String url, String authHeaderKey, String authHeaderValue, Object loginCallbackRequestData) {
        Runnable task = () -> {
            int retryCount = 0;
            while (retryCount < retryCallbackCount) {
                try {
                    HttpStatus responseStatus = backendService.sendCallback(url, authHeaderKey, authHeaderValue, loginCallbackRequestData);

                    if (responseStatus == HttpStatus.OK) {
                        log.info("Callback sent successfully to this url: {}", url);
                        callbackLogsService.saveOutboundCallbackLogs(requestId, "Callback sent successfully to this url: "+ url);
                        return; // Exit the loop if callback is successful
                    }
                    log.info("Got {}: Retrying to send callback", responseStatus);
                } catch (Exception e) {
                    log.error("Error occurred while sending callback: {}", e.getMessage());
                    callbackLogsService.saveOutboundCallbackLogsError(requestId, "Error occurred while sending callback: "+ e.getMessage());
                }
                log.info("Retrying to send callback");
                retryCount++;
            }
            log.error("Max retry count reached for sending callback to {}", url);
            callbackLogsService.saveOutboundCallbackLogsError(requestId, "Max retry count reached for sending callback to "+ url);
        };
        executorService.submit(task);
    }
}
