package com.azm.apihub.integrations.configuration;

import com.azm.apihub.integrations.baseServices.BackendService;
import com.azm.apihub.integrations.baseServices.dto.ApiKeyCredentials;
import com.azm.apihub.integrations.baseServices.dto.Company;
import com.azm.apihub.integrations.configuration.dto.CompanyCustomHeaderDto;
import com.azm.apihub.integrations.configuration.dto.CompanyDetails;
import com.azm.apihub.integrations.exceptions.BadRequestException;
import com.azm.apihub.integrations.exceptions.ForbiddenException;
import com.azm.apihub.integrations.utils.IntegrationConstants;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Objects;
@Slf4j
@Component
public class AuthenticationFilter extends OncePerRequestFilter {

    private static final String API_KEY_HEADER = "API-KEY";
    private final BackendService backendService;
    private final List<String> unSecuredEndpoints = Arrays.asList("/v1/tcc/nafath/callback",
            "/v1/tcc/callback-from-uapi",
            "/v1/neotek-callback/verification-requests/push",
            "/v1/neotek-callback/bulk-verification-requests/push",
            "/swagger-ui/**",
            "/v3/api-docs/**",
            "/actuator/**");


    public AuthenticationFilter(BackendService backendService) {
        this.backendService = backendService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String requestURI = request.getRequestURI();
        // Check if the request URI matches a public endpoint, and skip authentication if it does
        if (!isUnsecuredEndpoint(requestURI)) {
            try {
                String apiKey = extractApiKey(request);
                Company company = backendService.validateApiKey(apiKey);
                CompanyDetails companyDetails = new CompanyDetails(company);
                Authentication authentication = new UsernamePasswordAuthenticationToken(
                        companyDetails, new ApiKeyCredentials(apiKey),
                        new ArrayList<>());

                List<CompanyCustomHeaderDto> requiredCustomHeaderList =
                        backendService.findCustomHeadersByCompanyId(companyDetails.getCompany().getId());
                boolean hasValidCustomHeaders = checkRequestHasValidCustomHeaders(request, requiredCustomHeaderList);
                if (!hasValidCustomHeaders)
                    throw new ForbiddenException("You do not have the required headers in request to access this resource.");

                SecurityContextHolder.getContext().setAuthentication(authentication);

            } catch (HttpClientErrorException exception) {
                log.info("Unable to authorize user with the provided api-key");
                writeResponse(response, null, HttpServletResponse.SC_UNAUTHORIZED);
                return;
            } catch (BadRequestException exception) {
                log.info("API_KEY_DOES_NOT_EXIST");
                writeResponse(response, exception.getMessage(), HttpServletResponse.SC_BAD_REQUEST);
                return;
            } catch (ForbiddenException exception) {
                log.info(exception.getMessage());
                writeResponse(response, exception.getMessage(), HttpServletResponse.SC_FORBIDDEN);
                return;
            } catch (Exception exception) {
                log.info("Something bad happened while authenticating the api-key");
                writeResponse(response, exception.getMessage(), HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                return;
            }

        }

        filterChain.doFilter(request, response);
    }

    private boolean checkRequestHasValidCustomHeaders(HttpServletRequest request, List<CompanyCustomHeaderDto> requiredCustomHeaderList) {
        if (requiredCustomHeaderList.isEmpty() || requiredCustomHeaderList.stream().allMatch(header ->
                request.getHeader(header.getKey()) != null && request.getHeader(header.getKey()).equals(header.getValue())))
            return true;

        // To check required headers from custom-headers in case of Swagger
        String customHeaders = request.getHeader(IntegrationConstants.CUSTOM_HEADERS_KEY);
        if(Objects.isNull(customHeaders))
            return false;
        try {
            Map<String, String> customHeadersMap = new ObjectMapper().readValue(customHeaders, new TypeReference<>() {});
            return requiredCustomHeaderList.stream().allMatch(requiredHeader ->
                    customHeadersMap.get(requiredHeader.getKey()) != null && customHeadersMap.get(requiredHeader.getKey()).equals(requiredHeader.getValue()));
        } catch (JsonProcessingException e) {
            return false; // If JSON processing fails, return false
        }
    }

    private static void writeResponse(HttpServletResponse response, String message, int status) throws IOException {
        HttpServletResponse httpResponse = response;
        httpResponse.setStatus(status);
        httpResponse.setContentType(MediaType.APPLICATION_JSON_VALUE);
        PrintWriter writer = httpResponse.getWriter();

        if(StringUtils.isNotEmpty(message)) {
            ApiKeyResponse apiKeyResponse = new ApiKeyResponse();
            apiKeyResponse.message = message;
            ObjectMapper mapper = new ObjectMapper();
            writer.println(mapper.writeValueAsString(apiKeyResponse));
        }
        writer.flush();
        writer.close();
    }

    private String extractApiKey(HttpServletRequest request) {

        String apiKeyHeaderValue = request.getHeader(API_KEY_HEADER);
        if(StringUtils.isEmpty(apiKeyHeaderValue)) {
            throw new BadRequestException("API-KEY is missing");
        }

        return apiKeyHeaderValue;
    }

    private boolean isUnsecuredEndpoint(String requestURI) {
        // Check if the request URI matches a public endpoint pattern
        for (String pattern : unSecuredEndpoints) {
            if (new AntPathMatcher().match(pattern, requestURI)) {
                return true;
            }
        }
        return false;
    }
}

@Getter
@Setter
class ApiKeyResponse implements Serializable {
    String message;
}
