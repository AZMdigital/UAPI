package com.azm.apihub.integrations.baseServices;

import com.azm.apihub.integrations.baseServices.dto.Company;
import com.azm.apihub.integrations.baseServices.dto.CompanyConfiguration;
import com.azm.apihub.integrations.baseServices.dto.PublicKey;
import com.azm.apihub.integrations.baseServices.models.*;
import com.azm.apihub.integrations.baseServices.models.Package;
import com.azm.apihub.integrations.configuration.dto.CompanyCustomHeaderDto;
import com.azm.apihub.integrations.configuration.dto.CompanyDetails;
import com.azm.apihub.integrations.configuration.keycloak.auth.IntegrationTokenService;
import com.azm.apihub.integrations.exceptions.BadRequestException;
import com.azm.apihub.integrations.interceptor.enums.ServiceType;
import com.azm.apihub.integrations.interceptor.enums.TransactionStatus;
import com.azm.apihub.integrations.tcc.nafath.models.NafathLoginCallbackRequestData;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import java.lang.reflect.Type;
import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

@Slf4j
@Component
public class BackendService {

    private @Value("${backend.service.base-url}") String backendServiceBaseUrl;
    private @Value("${backend.service.service-head-info}")  String backendServiceHeadInfo;
    private @Value("${backend.service.service-credentials}") String backendCredentialsService;
    private @Value("${backend.service.service-head-credentials}") String backendCredentialsServiceHead;
    private @Value("${backend.service.system-credentials}") String backendSystemCredentials;
    private @Value("${backend.service.service-head-system-credentials}") String backendSystemCredentialsServiceHead;
    private @Value("${backend.service.api-key-validate}") String apiKeyValidationService;
    private @Value("${backend.service.public-key-info}") String publicKeyInfoService;
    private @Value("${backend.service.company-configuration}") String companyConfigurationService;
    private @Value("${backend.service.service-provider-logging}") String serviceProviderLoggingService;
    private @Value("${backend.service.request-log}") String requestLogService;
    private @Value("${backend.service.service-callback}") String serviceCallback;
    private @Value("${backend.service.service-info}")  String backendServiceInfo;
    private @Value("${backend.service.service-callback-by-transaction}") String serviceCallbackByTransaction;
    private @Value("${backend.service.callback-config}") String callbackConfig;
    private @Value("${backend.service.company-packages}") String companyPackages;
    private @Value("${backend.service.packages}") String packageService;
    private @Value("${backend.service.consumption-count}") String serviceConsumptionCount;
    private @Value("${backend.service.update-package-consumption}") String updateSelectedPackageConsumption;
    private @Value("${backend.service.send-consumption-alert}") String sendConsumptionAlert;
    private @Value("${backend.service.company-services-subscribed}") String companyServices;
    private @Value("${backend.service.is-subscribed-service-head}") String isServiceHeadSubscribe;
    private @Value("${backend.service.company-custom-headers}") String companyCustomHeadersService;
    private @Value("${backend.service.service-consumption-history}") String serviceConsumptionHistory;
    private @Value("${backend.service.service-consumption-history-count}") String serviceConsumptionHistoryCount;
    private @Value("${backend.service.service-consumption-from-history}") String serviceConsumptionFromHistory;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private IntegrationTokenService integrationTokenService;


    public List<com.azm.apihub.integrations.baseServices.models.ServiceHead> getServiceHeadsInfo(String serviceHead) {
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(backendServiceBaseUrl + backendServiceHeadInfo)
                .queryParam("serviceHeadName", URLEncoder.encode(serviceHead, StandardCharsets.UTF_8));

        HttpEntity<String> entity = new HttpEntity<>(getAuthHeader());
        log.info("Calling Service Head info API: {}", builder.toUriString());
        String response = restTemplate.exchange(builder.toUriString(), HttpMethod.GET, entity, String.class).getBody();

        Type serviceListType = new TypeToken<List<com.azm.apihub.integrations.baseServices.models.ServiceHead>>(){}.getType();

        return parseResponse( response, serviceListType);
    }

    public SubscribedServiceResponse checkIfServiceIsSubscribedByCompany(Long companyId, Long serviceId) {
        UriComponents builder = UriComponentsBuilder.fromHttpUrl(backendServiceBaseUrl + companyServices)
                .buildAndExpand(companyId, serviceId);
        HttpEntity<String> entity = new HttpEntity<>(getAuthHeader());

        log.info("Calling check service is subscribed by company API: {}", builder.toUriString());
        ResponseEntity<String> response = restTemplate.exchange(builder.toUriString(), HttpMethod.GET, entity, String.class);

        return parseResponse(response.getBody(), SubscribedServiceResponse.class);
    }

    public IsServiceHeadSubscribe checkIfServiceHeadIsSubscribedByCompany(Long companyId, Long serviceheadId) {
        UriComponents builder = UriComponentsBuilder.fromHttpUrl(backendServiceBaseUrl + isServiceHeadSubscribe)
                .buildAndExpand(companyId, serviceheadId);
        HttpEntity<String> entity = new HttpEntity<>(getAuthHeader());

        log.info("Calling check service head is subscribed by company API: {}", builder.toUriString());
        ResponseEntity<String> response = restTemplate.exchange(builder.toUriString(), HttpMethod.GET, entity, String.class);

        return parseResponse(response.getBody(), IsServiceHeadSubscribe.class);
    }


    public List<com.azm.apihub.integrations.baseServices.models.ServiceHead> getServiceHeadsInfo(Long serviceHeadId) {
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(backendServiceBaseUrl + backendServiceHeadInfo)
                .queryParam("serviceHeadId", serviceHeadId);

        HttpEntity<String> entity = new HttpEntity<>(getAuthHeader());
        log.info("Calling Service Head info API by id: {}", builder.toUriString());
        String response = restTemplate.exchange(builder.toUriString(), HttpMethod.GET, entity, String.class).getBody();

        Type serviceHeadListType = new TypeToken<List<com.azm.apihub.integrations.baseServices.models.ServiceHead>>(){}.getType();

        return parseResponse( response, serviceHeadListType);
    }

    public List<Service> getServiceInfo(String handle) {
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(backendServiceBaseUrl + backendServiceInfo)
                .queryParam("handle", handle);

        HttpEntity<String> entity = new HttpEntity<>(getAuthHeader());

        log.info("Calling Service info API: {}", builder.toUriString());
        String response = restTemplate.exchange(builder.toUriString(), HttpMethod.GET, entity, String.class).getBody();

        Type serviceListType = new TypeToken<List<Service>>(){}.getType();
        return parseResponse( response, serviceListType);
    }

    public ServiceCredentials getServiceCredentials(long serviceProviderId, long companyId) {
        UriComponents builder = UriComponentsBuilder.fromHttpUrl(backendServiceBaseUrl + backendCredentialsService)
                .queryParam("companyId", companyId)
                .buildAndExpand(serviceProviderId);

        HttpEntity<String> entity = new HttpEntity<>(getAuthHeader());
        log.info("Calling Service credentials API: {}", builder.toUriString());
        String response = restTemplate.exchange(builder.toUriString(), HttpMethod.GET, entity, String.class).getBody();

        return parseResponse(response, ServiceCredentials.class);
    }

    public ServiceCredentials getServiceHeadCredentials(long serviceProviderId, long serviceHeadId, long companyId) {
        UriComponents builder = UriComponentsBuilder.fromHttpUrl(backendServiceBaseUrl + backendCredentialsServiceHead)
                .queryParam("companyId", companyId)
                .buildAndExpand(serviceProviderId, serviceHeadId);

        HttpEntity<String> entity = new HttpEntity<>(getAuthHeader());
        log.info("Calling Service Head credentials API: {}", builder.toUriString());
        String response = restTemplate.exchange(builder.toUriString(), HttpMethod.GET, entity, String.class).getBody();

        return parseResponse(response, ServiceCredentials.class);
    }

    public ServiceCredentials getSystemCredentials(long serviceProviderId) {
        UriComponents builder = UriComponentsBuilder.fromHttpUrl(backendServiceBaseUrl + backendSystemCredentials)
                .buildAndExpand(serviceProviderId);

        HttpEntity<String> entity = new HttpEntity<>(getAuthHeader());
        log.info("Calling System Service credentials API: {}", builder.toUriString());
        String response = restTemplate.exchange(builder.toUriString(), HttpMethod.GET, entity, String.class).getBody();

        return parseResponse(response, ServiceCredentials.class);
    }

    public ServiceCredentials getServiceHeadSystemCredentials(long serviceProviderId, long serviceHeadId) {
        UriComponents builder = UriComponentsBuilder.fromHttpUrl(backendServiceBaseUrl + backendSystemCredentialsServiceHead)
                .buildAndExpand(serviceProviderId, serviceHeadId);

        HttpEntity<String> entity = new HttpEntity<>(getAuthHeader());
        log.info("Calling System Service Head credentials API: {}", builder.toUriString());
        String response = restTemplate.exchange(builder.toUriString(), HttpMethod.GET, entity, String.class).getBody();

        return parseResponse(response, ServiceCredentials.class);
    }

    public ServiceCredentials getServiceCredentials(String serviceHead) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CompanyDetails companyDetails = (CompanyDetails) authentication.getPrincipal();
        List<com.azm.apihub.integrations.baseServices.models.ServiceHead> serviceHeads = getServiceHeadsInfo(serviceHead);
        ServiceCredentials credentials = null;
        try {
            com.azm.apihub.integrations.baseServices.models.ServiceHead serviceHeadInfo = serviceHeads.get(0);
            ServiceProvider serviceProvider = serviceHeadInfo.getServiceProvider();

            if(serviceProvider.getClientCredentialsAllowed()) {
                try {
                    if (serviceProvider.getRequiresServiceHeadCredentials()) {
                        credentials = getServiceHeadCredentials(serviceProvider.getId(), serviceHeadInfo.getId(), companyDetails.getCompany().getId());

                        if (credentials == null || !credentials.getUseClientCredentials())
                            credentials = getServiceHeadSystemCredentials(serviceProvider.getId(), serviceHeadInfo.getId());
                    } else {
                        credentials = getServiceCredentials(serviceProvider.getId(), companyDetails.getCompany().getId());

                        if (credentials == null || !credentials.getUseClientCredentials())
                            credentials = getSystemCredentials(serviceProvider.getId());
                    }
                } catch (HttpClientErrorException exception) {
                    if (HttpStatus.NOT_FOUND == exception.getStatusCode()) {
                        log.error("Client credentials not found, Getting system credentials");
                        if (serviceProvider.getRequiresServiceHeadCredentials()) {
                            credentials = getServiceHeadSystemCredentials(serviceProvider.getId(), serviceHeadInfo.getId());
                        } else {
                            credentials = getSystemCredentials(serviceProvider.getId());
                        }
                    }
                }
            } else {
                if(serviceProvider.getRequiresServiceHeadCredentials())
                    credentials = getServiceHeadSystemCredentials(serviceProvider.getId(), serviceHeadInfo.getId());
                else
                    credentials = getSystemCredentials(serviceProvider.getId());
            }
        } catch (HttpClientErrorException exception) {
            if(HttpStatus.NOT_FOUND == exception.getStatusCode()) {
                throw new BadRequestException("Client credentials are not configured. Please add credentials before calling this service: "+exception.getMessage());
            }
            throw exception;
        }

        return credentials;
    }

    public ServiceProviderLogging getServiceProviderLoggingInfo(Long companyId, Long serviceProviderId) {
        UriComponents builder = UriComponentsBuilder.fromHttpUrl(backendServiceBaseUrl + serviceProviderLoggingService)
                .buildAndExpand(companyId, serviceProviderId);

        HttpEntity<String> entity = new HttpEntity<>(getAuthHeader());
        log.info("Calling Service Provider logging info API: {}", builder.toUriString());
        String response = restTemplate.exchange(builder.toUriString(), HttpMethod.GET, entity, String.class).getBody();
        return parseResponse( response, ServiceProviderLogging.class);
    }

    public void addRequestLog(UUID requestId, long companyId, long serviceId, String method, Boolean isClientCredentialsUsed,
                              Boolean isMockup, Boolean isPostpaid) {
        RequestLogAddRequest request = new RequestLogAddRequest(
                requestId, companyId, serviceId, method, isClientCredentialsUsed, isMockup, isPostpaid);

        UriComponents builder = UriComponentsBuilder.fromHttpUrl(backendServiceBaseUrl + requestLogService).build();

        log.info("Calling add log request API: {}", builder.toUriString());

        HttpHeaders headers = getAuthHeader();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<RequestLogAddRequest> requestEntity = new HttpEntity<>(request, headers);

        var response = restTemplate.exchange(builder.toUriString(), HttpMethod.POST, requestEntity, String.class);

        if(response.getStatusCode() == HttpStatus.CREATED)
            log.info("Request successfully logged in DB ");
        else
            log.info("Request not logged in DB: {}", response.getStatusCode());
    }

    public void updateRequestLog(UUID requestId, int responseCode, String method, String errorDescription, String errorCode,
                                 Boolean isClientCredentialsUsed, Boolean isMockup, Long selectedPackageId) {
        RequestLogUpdateRequest request = new RequestLogUpdateRequest(requestId, responseCode, method, errorDescription,
                errorCode, isClientCredentialsUsed, isMockup, selectedPackageId);

        UriComponents builder = UriComponentsBuilder.fromHttpUrl(backendServiceBaseUrl + requestLogService).build();

        log.info("Calling update log request API: {}", builder.toUriString());

        HttpHeaders headers = getAuthHeader();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<RequestLogUpdateRequest> requestEntity = new HttpEntity<>(request, headers);

        var response = restTemplate.exchange(builder.toUriString(), HttpMethod.PUT, requestEntity, String.class);

        if(response.getStatusCode() == HttpStatus.OK)
            log.info("Request successfully updated in DB ");
        else
            log.info("Request not updated in DB: {}", response.getStatusCode());
    }

    public void addCallbackTransaction(long companyId, long serviceId, String transactionId) {
        ServiceCallbackTransactionRequest request = new ServiceCallbackTransactionRequest(companyId, serviceId, transactionId);

        UriComponents builder = UriComponentsBuilder.fromHttpUrl(backendServiceBaseUrl + serviceCallback).build();

        log.info("Calling add service callback transaction request API: "+builder.toUriString());

        HttpHeaders headers = getAuthHeader();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<ServiceCallbackTransactionRequest> requestEntity = new HttpEntity<>(request, headers);

        var response = restTemplate.exchange(builder.toUriString(), HttpMethod.POST, requestEntity, String.class);

        if(response.getStatusCode() == HttpStatus.CREATED)
            log.info("Service transaction callback successfully added in DB ");
        else
            log.info("Service transaction callback not added in DB: "+response.getStatusCode());
    }

    public void updateCallbackTransaction(String transactionId) {
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(backendServiceBaseUrl + serviceCallback)
                .queryParam("transactionId", transactionId);

        log.info("Calling update service callback transaction request API: {}", builder.toUriString());

        HttpHeaders headers = getAuthHeader();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<ServiceCallbackTransactionRequest> requestEntity = new HttpEntity<>(null, headers);

        var response = restTemplate.exchange(builder.toUriString(), HttpMethod.PUT, requestEntity, String.class);

        if(response.getStatusCode() == HttpStatus.OK)
            log.info("Service transaction callback successfully updated in DB ");
        else
            log.info("Service transaction callback not updated in DB: {}", response.getStatusCode());
    }

    public HttpStatus sendCallback(String url, String authHeaderKey, String authHeaderValue, Object callbackRequestData) {
        UriComponents builder = UriComponentsBuilder.fromHttpUrl(url).build();

        log.info("Calling add service callback transaction request API: "+builder.toUriString());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        if(StringUtils.isNotBlank(authHeaderKey))
            headers.set(authHeaderKey, authHeaderValue);
        else
            headers.set("Authorization", "apikey " + authHeaderValue);

//        headers.set("API-KEY", "01489063-046a-42f7-9171-d15acfc9cc88");
        HttpEntity<Object> requestEntity = new HttpEntity<>(callbackRequestData, headers);

        var response = restTemplate.exchange(builder.toUriString(), HttpMethod.POST, requestEntity, String.class);

        return response.getStatusCode();
    }

    public ServiceCallback getServiceCallbackByTransactionId(String transactionId) {
        try {
            UriComponents builder = UriComponentsBuilder.fromHttpUrl(backendServiceBaseUrl + serviceCallbackByTransaction)
                    .buildAndExpand(transactionId);

            HttpEntity<String> httpEntity = new HttpEntity<>(getAuthHeader());
            log.info("Calling callback config service by transaction id: {}", builder.toUriString());
            ResponseEntity<String> response = restTemplate.exchange(builder.toUriString(), HttpMethod.GET, httpEntity, String.class);

            return parseResponse(response.getBody(), ServiceCallback.class);
        } catch (HttpClientErrorException e) {
            log.error(e.getMessage());
            return null;
        }
    }

    public CompanyCallbackConfig getServiceCallbackConfig(Long companyId, Long serviceId) {
        try {
            UriComponents builder = UriComponentsBuilder.fromHttpUrl(backendServiceBaseUrl + callbackConfig)
                    .buildAndExpand(companyId, serviceId);

            HttpEntity<String> httpEntity = new HttpEntity<>(getAuthHeader());
            log.info("Calling callback config service: {}", builder.toUriString());
            ResponseEntity<String> response = restTemplate.exchange(builder.toUriString(), HttpMethod.GET, httpEntity, String.class);

            return parseResponse(response.getBody(), CompanyCallbackConfig.class);
        } catch (HttpClientErrorException e) {
        log.error(e.getMessage());
        return null;
    }
    }

    public PublicKey getPublicKeyInfo(long companyId) {
        UriComponents builder = UriComponentsBuilder.fromHttpUrl(backendServiceBaseUrl + publicKeyInfoService)
                .buildAndExpand(companyId);

        HttpEntity<String> httpEntity = new HttpEntity<>(getAuthHeader());
        log.info("Calling Public key info API: {}", builder.toUriString());
        return restTemplate.exchange(builder.toUriString(), HttpMethod.GET, httpEntity, PublicKey.class).getBody();
    }

    public CompanyConfiguration getCompanyConfiguration(long companyId, String configName) {
        UriComponents builder = UriComponentsBuilder.fromHttpUrl(backendServiceBaseUrl + companyConfigurationService)
                .queryParam("name", configName)
                .buildAndExpand(companyId);

        HttpEntity<String> httpEntity = new HttpEntity<>(getAuthHeader());

        log.info("Calling Company configuration API: {}", builder.toUriString());
        return restTemplate.exchange(builder.toUriString(), HttpMethod.GET, httpEntity, CompanyConfiguration.class).getBody();
    }

    public List<CompanyPackageSelected> getSelectedCompanyPackages(Long companyId) {
        UriComponents builder = UriComponentsBuilder.fromHttpUrl(backendServiceBaseUrl + companyPackages)
                .buildAndExpand(companyId);

        HttpEntity<String> httpEntity = new HttpEntity<>(getAuthHeader());

        log.info("Getting company selected packages: {}", builder.toUriString());
        String response = restTemplate.exchange(builder.toUriString(), HttpMethod.GET, httpEntity, String.class).getBody();

        Type serviceListType = new TypeToken<List<CompanyPackageSelected>>(){}.getType();

        return parseResponse( response, serviceListType);
    }

    public void sendConsumptionUsageAlert(long companyId, String packageType, Double consumptionPercentage, Long companyPackageSelectedId) {
        UriComponents builder = UriComponentsBuilder.fromHttpUrl(backendServiceBaseUrl + sendConsumptionAlert)
                .queryParam("packageType", packageType)
                .queryParam("consumptionPercentage", consumptionPercentage)
                .queryParam("companyPackageSelectedId", companyPackageSelectedId)
                .buildAndExpand(companyId);

        HttpEntity<String> httpEntity = new HttpEntity<>(getAuthHeader());

        log.info("Sending consumption alert to users: {}", builder.toUriString());
        var response = restTemplate.exchange(builder.toUriString(), HttpMethod.GET, httpEntity, String.class);

        if(response.getStatusCode() == HttpStatus.OK)
            log.info("Consumption usage Alert sent successfully");
    }

    public HttpStatus updateUserPackage(Package cPackage) {
        UriComponents builder = UriComponentsBuilder.fromHttpUrl(backendServiceBaseUrl + packageService)
                .buildAndExpand(cPackage.getId());

        log.info("Updating package transaction limit: {}", builder.toUriString());

        PackageRequest packageRequest = new PackageRequest();
        packageRequest.setPackageType(cPackage.getPackageType());
        packageRequest.setPackagePeriod(cPackage.getPackagePeriod());
        packageRequest.setPricePerPeriod(cPackage.getPricePerPeriod());
        packageRequest.setTransactionLimit(cPackage.getTransactionLimit());
        packageRequest.setActive(cPackage.getIsActive());
        packageRequest.setName(cPackage.getName());
        packageRequest.setArabicName(cPackage.getArabicName());
        packageRequest.setActivationDate(cPackage.getActivationDate().toLocalDateTime().toLocalDate());

        HttpHeaders headers = getAuthHeader();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<PackageRequest> requestEntity = new HttpEntity<>(packageRequest, headers);

        var response = restTemplate.exchange(builder.toUriString(), HttpMethod.PUT, requestEntity, String.class);

        if(response.getStatusCode() == HttpStatus.OK)
            log.info("Transaction limit added successfully");
        else
            log.info("Transaction limit not updated in DB: {}", response.getStatusCode());

        return response.getStatusCode();
    }

    public HttpStatus updateSelectedPackageConsumption(Long selectedPackageId, Integer transactionConsumption, Double priceConsumption) {
        UriComponents builder = UriComponentsBuilder.fromHttpUrl(backendServiceBaseUrl + updateSelectedPackageConsumption)
                .buildAndExpand(selectedPackageId);

        log.info("Updating selected package consumption: {}", builder.toUriString());

        SelectedPackageUpdateConsumptionRequest packageRequest = new SelectedPackageUpdateConsumptionRequest();
        packageRequest.setTransactionConsumption(transactionConsumption);
        packageRequest.setPriceConsumption(priceConsumption);

        HttpHeaders headers = getAuthHeader();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<SelectedPackageUpdateConsumptionRequest> requestEntity = new HttpEntity<>(packageRequest, headers);

        var response = restTemplate.exchange(builder.toUriString(), HttpMethod.PUT, requestEntity, String.class);

        if(response.getStatusCode() == HttpStatus.CREATED)
            log.info("Consumption for selected package is updated successfully");
        else
            log.info("Consumption for selected package not updated in DB: {}", response.getStatusCode());

        return response.getStatusCode();
    }

    public Company validateApiKey(String apiKey) {

        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(backendServiceBaseUrl + apiKeyValidationService);

        HttpHeaders headers = getAuthHeader();
        headers.set("api-key", apiKey);
        HttpEntity<String> entity = new HttpEntity<>(headers);

        log.info("Calling api key validate API: {}", builder.toUriString());
        return restTemplate.exchange(builder.toUriString(), HttpMethod.GET, entity, Company.class).getBody();
    }

    public Long getServiceConsumptionCount(long companyId, long serviceId, String activationDate) {
        UriComponents builder = UriComponentsBuilder.fromHttpUrl(backendServiceBaseUrl + serviceConsumptionCount)
                .queryParam("activationDate", activationDate)
                .buildAndExpand(companyId, serviceId);

        HttpEntity<String> entity = new HttpEntity<>(getAuthHeader());
        log.info("Calling Consumption count API: {}", builder.toUriString());
        String response = restTemplate.exchange(builder.toUriString(), HttpMethod.GET, entity, String.class).getBody();

        ServiceConsumptionCount serviceConsumptionCount = parseResponse(response, ServiceConsumptionCount.class);
        return serviceConsumptionCount.getCount();
    }

    public Long getServiceConsumptionHistoryCount(long companyId, long serviceId, String serviceType) {
        UriComponents builder = UriComponentsBuilder.fromHttpUrl(backendServiceBaseUrl + serviceConsumptionHistoryCount)
                .queryParam("serviceType", serviceType)
                .buildAndExpand(companyId, serviceId);

        HttpEntity<String> entity = new HttpEntity<>(getAuthHeader());
        log.info("Calling Consumption history count API: {}", builder.toUriString());
        String response = restTemplate.exchange(builder.toUriString(), HttpMethod.GET, entity, String.class).getBody();

        ServiceConsumptionCount serviceConsumptionCount = parseResponse(response, ServiceConsumptionCount.class);
        return serviceConsumptionCount.getCount();
    }

    public BigDecimal getServiceConsumptionAmountFromHistory(long companyId, long serviceId, String serviceType) {
        UriComponents builder = UriComponentsBuilder.fromHttpUrl(backendServiceBaseUrl + serviceConsumptionFromHistory)
                .queryParam("serviceType", serviceType)
                .buildAndExpand(companyId, serviceId);

        HttpEntity<String> entity = new HttpEntity<>(getAuthHeader());
        log.info("Calling Service Consumption from history API: {}", builder.toUriString());
        String response = restTemplate.exchange(builder.toUriString(), HttpMethod.GET, entity, String.class).getBody();

        ServiceConsumption serviceConsumptionCount = parseResponse(response, ServiceConsumption.class);
        return serviceConsumptionCount.getConsumption();
    }

    public void addTransactionConsumptionHistory(long companyId, long serviceId, BigDecimal consumedPrice, boolean isTier,
                                                 TransactionStatus transactionStatus, ServiceType serviceType, boolean isMockup,
                                                 boolean clientCredentialUsed, Long companyPackageSelectedId, Long pricingId,
                                                 String companyName, String companyUnifiedNationalNumber, String serviceName,
                                                 String serviceCode, String errorCode, String errorDescription, Integer responseCode,
                                                 Long mainAccountId, String accountType, Boolean useMainAccountBundles) {
        ServiceConsumptionHistoryRequest request = new ServiceConsumptionHistoryRequest(consumedPrice, isTier,
                transactionStatus.name(), serviceType.name(), isMockup, clientCredentialUsed, companyPackageSelectedId, pricingId,
                companyName, companyUnifiedNationalNumber, serviceName, serviceCode, errorCode, errorDescription, responseCode,
                mainAccountId, accountType, useMainAccountBundles);

        UriComponents builder = UriComponentsBuilder.fromHttpUrl(backendServiceBaseUrl + serviceConsumptionHistory)
                .buildAndExpand(companyId, serviceId);

        log.info("Calling add service consumption history request API: {}", builder.toUriString());

        HttpHeaders headers = getAuthHeader();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<ServiceConsumptionHistoryRequest> requestEntity = new HttpEntity<>(request, headers);

        var response = restTemplate.exchange(builder.toUriString(), HttpMethod.POST, requestEntity, String.class);

        if(response.getStatusCode() == HttpStatus.CREATED)
            log.info("Service consumption history successfully added in DB");
        else
            log.info("Service  consumption history not added in DB: {}", response.getStatusCode());
    }


    protected <T> T parseResponse(String responseJson, Type type) {
        Gson gson = new Gson();
        return gson.fromJson(responseJson, type);
    }

    private HttpHeaders getAuthHeader() {
        HttpHeaders headers = new HttpHeaders();
        String token = integrationTokenService.getAuthTokenFromBackend().getToken();
        headers.set("Authorization", "Bearer " + token);
        return headers;
    }

    public List<CompanyCustomHeaderDto> findCustomHeadersByCompanyId(Long companyId) {
        UriComponents builder = UriComponentsBuilder
                .fromHttpUrl(backendServiceBaseUrl + companyCustomHeadersService)
                .buildAndExpand(companyId);

        HttpHeaders headers = getAuthHeader();
        HttpEntity<String> entity = new HttpEntity<>(headers);

        log.info("Calling Get Company Custom Headers API: {}", builder.toUriString());
        return restTemplate.exchange(builder.toUriString(), HttpMethod.GET, entity,
                        new ParameterizedTypeReference<List<CompanyCustomHeaderDto>>() {})
                .getBody();
    }
}
