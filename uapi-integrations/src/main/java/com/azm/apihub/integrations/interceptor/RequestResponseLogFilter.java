package com.azm.apihub.integrations.interceptor;

import com.azm.apihub.integrations.baseServices.BackendService;
import com.azm.apihub.integrations.baseServices.dto.Company;
import com.azm.apihub.integrations.baseServices.models.ServiceHead;
import com.azm.apihub.integrations.baseServices.models.ServiceProviderLogging;
import com.azm.apihub.integrations.configuration.dto.CompanyAccountType;
import com.azm.apihub.integrations.configuration.dto.CompanyDetails;
import com.azm.apihub.integrations.entities.IntegrationLogs;
import com.azm.apihub.integrations.repository.IntegrationLogsRepository;
import com.azm.apihub.integrations.utils.IntegrationUtils;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Objects;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.util.ContentCachingRequestWrapper;
import org.springframework.web.util.ContentCachingResponseWrapper;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Slf4j
@Component
public class RequestResponseLogFilter implements Filter {
    private static final String INCLUDED_PATH_PREFIX = "/v1";
    private static final String UUID_ATTRIBUTE_NAME = "requestUuid";

    private final Boolean enableApiLogging;

    private final BackendService backendService;
    private final IntegrationLogsRepository integrationLogsRepository;

    public RequestResponseLogFilter(BackendService backendService,
                                    IntegrationLogsRepository integrationLogsRepository,
                                    @Value("${integration.logging}")  Boolean enableApiLogging) {

        this.backendService = backendService;
        this.integrationLogsRepository = integrationLogsRepository;
        this.enableApiLogging = enableApiLogging;
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        if (enableApiLogging) {
            HttpServletRequest httpRequest = (HttpServletRequest) request;
            HttpServletResponse httpResponse = (HttpServletResponse) response;

            long startTime = System.currentTimeMillis();
            // Create a response wrapper to capture response content
            ContentCachingResponseWrapper responseWrapper = new ContentCachingResponseWrapper(httpResponse);
            ContentCachingRequestWrapper requestWrapper = new ContentCachingRequestWrapper(httpRequest);

            // Continue the filter chain with the wrapped response
            chain.doFilter(requestWrapper, responseWrapper);

            long endTime = System.currentTimeMillis();

            try {
                // Setting the RequestResponse to be saved in the MongoDB
                createRequestLogs(httpRequest, httpResponse, requestWrapper, responseWrapper, startTime, endTime);

            } catch (Exception e) {
                log.error("Request could not be logged because of following exception.... {}", e.getMessage());
                //return;
            }

            //Releasing the response below to be un-wrapped and return to the flow for view
            byte[] contentBytes = responseWrapper.getContentAsByteArray();

            response.setContentLength(contentBytes.length);

            response.getOutputStream().write(contentBytes);
        } else
            chain.doFilter(request, response);

    }

    void createRequestLogs(HttpServletRequest request, HttpServletResponse response,
                           ContentCachingRequestWrapper requestWrapper, ContentCachingResponseWrapper responseWrapper,
                           long requestTime, long responseTime) throws Exception{
        IntegrationLogs requestResponseLogs;

        byte[] responseContentBytes = responseWrapper.getContentAsByteArray();
        String responseBody = new String(responseContentBytes, StandardCharsets.UTF_8);

        byte[] requestContentBytes = requestWrapper.getContentAsByteArray();
        String requestBody = new String(requestContentBytes, StandardCharsets.UTF_8);

        String operationName = request.getRequestURI().substring(INCLUDED_PATH_PREFIX.length());;
        String serviceNameUri = IntegrationUtils.getUriWithoutPathVariables(operationName);

        if(!serviceNameUri.equals("mock") && !operationName.contains("/callback") && !operationName.contains("digital-signature")) {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            log.debug("Company details for logging response: {}", authentication.getPrincipal());

            if (authentication.getPrincipal() instanceof CompanyDetails companyDetails) {

                Company company = companyDetails.getCompany();
                var service = backendService.getServiceInfo(serviceNameUri);
                long serviceHeadId = service.get(0).getServiceHeadId();
                String serviceName = service.get(0).getName();

                List<ServiceHead> serviceHead = backendService.getServiceHeadsInfo(service.get(0).getServiceHeadId());
                long serviceProviderId = serviceHead.get(0).getServiceProvider().getId();

                ServiceProviderLogging serviceProviderLoggingInfo;
                if (Objects.equals(company.getAccountType(), CompanyAccountType.SUB.name()))
                    serviceProviderLoggingInfo = backendService.getServiceProviderLoggingInfo(company.getMainAccountId(), serviceProviderId);
                else
                    serviceProviderLoggingInfo = backendService.getServiceProviderLoggingInfo(company.getId(), serviceProviderId);

                //If user subscribed to log info of service then this `serviceProviderLoggingInfo` will not be null
                if (serviceProviderLoggingInfo != null) {
                    log.info("Logging request and response for that service provider: {}", serviceProviderLoggingInfo.getServiceProvider().getName());
                    // Setting the RequestResponse to be saved in the MongoDB
                    requestResponseLogs = IntegrationUtils.setRequestAndResponse(request, response, requestBody, responseBody, serviceName, serviceHeadId, UUID_ATTRIBUTE_NAME, requestTime, responseTime);
                    requestResponseLogs.setAccountId(company.getId());

                    // This is to check if status not equal to 302 in mock case
                    if (requestResponseLogs.getResponse().getStatus() != 302)
                        integrationLogsRepository.save(requestResponseLogs);
                }
            }
        }

    }
}
