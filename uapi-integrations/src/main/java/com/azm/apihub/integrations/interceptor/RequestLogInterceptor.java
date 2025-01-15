package com.azm.apihub.integrations.interceptor;

import com.azm.apihub.integrations.baseServices.BackendService;
import com.azm.apihub.integrations.baseServices.dto.Company;
import com.azm.apihub.integrations.baseServices.models.ServiceCredentials;
import com.azm.apihub.integrations.baseServices.models.ServiceHead;
import com.azm.apihub.integrations.configuration.dto.CompanyDetails;
import com.azm.apihub.integrations.exceptions.GlobalExceptionHandlerHolder;
import com.azm.apihub.integrations.interceptor.Utils.ServiceAccessVerifier;
import com.azm.apihub.integrations.interceptor.enums.ServiceType;
import com.azm.apihub.integrations.mock.services.MockService;
import com.azm.apihub.integrations.tcc.nafath.models.NafathLoginResponse;
import com.google.gson.Gson;
import java.io.IOException;
import java.util.List;
import java.util.UUID;
import com.azm.apihub.integrations.utils.IntegrationUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Slf4j
public class RequestLogInterceptor implements HandlerInterceptor {
    private static final String INCLUDED_PATH_PREFIX = "/v1";
    private static final String UUID_ATTRIBUTE_NAME = "requestUuid";
    private static final String SERVICE_URI_ATTRIBUTE = "serviceUri";
    private static final String COMPANY_ID_ATTRIBUTE = "companyId";
    private static final String COMPANY_NAME_ATTRIBUTE = "companyName";
    private static final String COMPANY_UNIFIED_NATIONAL_NUMBER_ATTRIBUTE = "companyUnifiedNationalNumber";
    private static final String IS_USE_CLIENT_CREDENTIALS_ATTRIBUTE = "useClientCredentials";
    private static final String IS_POSTPAID_ATTRIBUTE = "isPostpaid";
    private static final String MAIN_ACCOUNT_ID_ATTRIBUTE = "mainAccountId";
    private static final String ACCOUNT_TYPE_ATTRIBUTE = "accountType";
    private static final String USE_MAIN_ACCOUNT_BUNDLES_ATTRIBUTE = "useMainAccountBundles";

    @Autowired
    private BackendService backendService;

    @Autowired
    private ServiceAccessVerifier serviceAccessVerifier;

    @Autowired
    private MockService mockService;

    @PostConstruct
    public void init() {
        log.info("Initializing Request log Interceptor");
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws IOException {
        String requestUri = request.getRequestURI();
        if (!requestUri.startsWith(INCLUDED_PATH_PREFIX)) {
            return true; // Skip logging
        }

        if(!requestUri.contains("/callback") && !requestUri.contains("digital-signature")) {

            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            CompanyDetails companyDetails = (CompanyDetails) authentication.getPrincipal();
            Company company = companyDetails.getCompany();

            UUID requestUuid = UUID.randomUUID();
            request.setAttribute(UUID_ATTRIBUTE_NAME, requestUuid);

            String operationName = requestUri.substring(INCLUDED_PATH_PREFIX.length());;
            String serviceNameUri = IntegrationUtils.getUriWithoutPathVariables(operationName);

            log.debug("Pre handle => Response Status: {} with request uuid: {}", response.getStatus(), requestUuid);
            log.debug("Request URI: {}", requestUri);
            log.debug("Operation Name: {}", operationName);
            log.debug("Service Name: {}", serviceNameUri);
            log.debug("Request URL: {}", request.getRequestURL());
            log.debug("HTTP Method: {}", request.getMethod());
            log.debug("Query String: {}", request.getQueryString());
            request.setAttribute(SERVICE_URI_ATTRIBUTE, serviceNameUri);
            request.setAttribute(COMPANY_ID_ATTRIBUTE, company.getId());
            request.setAttribute(COMPANY_NAME_ATTRIBUTE, company.getCompanyName());
            request.setAttribute(COMPANY_UNIFIED_NATIONAL_NUMBER_ATTRIBUTE, company.getUnifiedNationalNumber());
            request.setAttribute(IS_POSTPAID_ATTRIBUTE, company.getServicesPostpaidSubscribed());
            request.setAttribute(MAIN_ACCOUNT_ID_ATTRIBUTE, company.getMainAccountId());
            request.setAttribute(ACCOUNT_TYPE_ATTRIBUTE, company.getAccountType());
            request.setAttribute(USE_MAIN_ACCOUNT_BUNDLES_ATTRIBUTE, company.getUseMainAccountBundles());

            var service = backendService.getServiceInfo(serviceNameUri);

            if (service != null && !service.isEmpty()) {
                if (service.get(0).getIsMock()) {
                    sendMockRequest(response, requestUuid, company.getId(), serviceNameUri, service.get(0).getId(), request.getMethod(), company.getServicesPostpaidSubscribed());
                    return false;
                } else {
                    List<ServiceHead> serviceHead = backendService.getServiceHeadsInfo(service.get(0).getServiceHeadId());
                    ServiceCredentials serviceCredentials = backendService.getServiceCredentials(serviceHead.get(0).getName());

                    Boolean useClientCredentials = serviceCredentials.getUseClientCredentials() != null ? serviceCredentials.getUseClientCredentials() : false;
                    request.setAttribute(IS_USE_CLIENT_CREDENTIALS_ATTRIBUTE, useClientCredentials);

                    serviceAccessVerifier.checkIfServiceIsEligibleToMakeCall(company, service.get(0), company.getServicesPostpaidSubscribed(), useClientCredentials);
                    backendService.addRequestLog(requestUuid, company.getId(), service.get(0).getId(), request.getMethod(),
                            useClientCredentials, false, company.getServicesPostpaidSubscribed());
                }
            } else
                log.info("Request could not be registered because service is null");
        }

        return true;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler,ModelAndView modelAndView) throws Exception {
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws IOException {
        String requestUri = request.getRequestURI();
        Long selectedPackageId = null;

        if (requestUri.startsWith(INCLUDED_PATH_PREFIX)) {
            UUID requestUuid = (UUID) request.getAttribute(UUID_ATTRIBUTE_NAME);
            String serviceUri = (String) request.getAttribute(SERVICE_URI_ATTRIBUTE);
            Long companyId = (Long) request.getAttribute(COMPANY_ID_ATTRIBUTE);
            String companyName = (String) request.getAttribute(COMPANY_NAME_ATTRIBUTE);
            String companyUnifiedNationalNumber = (String) request.getAttribute(COMPANY_UNIFIED_NATIONAL_NUMBER_ATTRIBUTE);
            Boolean isPostpaid = (Boolean) request.getAttribute(IS_POSTPAID_ATTRIBUTE);
            Long mainAccountId = (Long) request.getAttribute(MAIN_ACCOUNT_ID_ATTRIBUTE);
            String accountType = (String) request.getAttribute(ACCOUNT_TYPE_ATTRIBUTE);
            Boolean useMainAccountBundles = (Boolean) request.getAttribute(USE_MAIN_ACCOUNT_BUNDLES_ATTRIBUTE);

            Exception storedException = GlobalExceptionHandlerHolder.getException();
            String  errorCode = GlobalExceptionHandlerHolder.getErrorCode();
            String errorDescription = null;
            if (storedException != null) {
                errorDescription = storedException.getMessage();
                GlobalExceptionHandlerHolder.clearException();
            }

            if(!requestUri.contains("/callback") && !requestUri.contains("digital-signature")) {
                var service = backendService.getServiceInfo(serviceUri);
                Boolean useClientCredentials = (Boolean) request.getAttribute(IS_USE_CLIENT_CREDENTIALS_ATTRIBUTE);

                if(!useClientCredentials && !isPostpaid)
                    selectedPackageId = serviceAccessVerifier.deductServicePrice(service.get(0), response.getStatus(), companyId, false,
                            companyName, companyUnifiedNationalNumber, errorCode, errorDescription, mainAccountId, accountType, useMainAccountBundles);

                if(isPostpaid)
                    serviceAccessVerifier.addTransactionConsumptionHistory(service.get(0), companyId, response.getStatus(),
                            service.get(0).getPricing().getIsTier(), ServiceType.POSTPAID, false, useClientCredentials, null,
                            companyName, companyUnifiedNationalNumber, errorCode, errorDescription, response.getStatus(), mainAccountId, accountType, useMainAccountBundles);
                backendService.updateRequestLog(requestUuid, response.getStatus(), null, errorDescription,
                        errorCode, useClientCredentials, false, selectedPackageId);
            }
        }
    }

    private void sendMockRequest(HttpServletResponse response, UUID requestId, Long companyId, String serviceNameUri,
                                 Long serviceId, String method, boolean isPostpaid) throws IOException {
        log.info("Sending mock request");
        if(serviceNameUri.equals("sdaia/nafath-login")) {
            // Register transaction id in db
            Gson gson = new Gson();
            NafathLoginResponse loginResponse = gson.fromJson(mockService.getMockServiceData(serviceNameUri, serviceId), NafathLoginResponse.class);

            backendService.addCallbackTransaction(
                    companyId,
                    serviceId,
                    loginResponse.getTransId());
        }

        response.setHeader("content-type", "application/json");
        response.setStatus(200);
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(mockService.getMockServiceData(serviceNameUri, serviceId));
        backendService.addRequestLog(requestId, companyId, serviceId, method, null, true, isPostpaid);
        backendService.updateRequestLog(requestId, response.getStatus(), null, null, null, null, true, null);
    }
}
