package com.azm.apihub.integrations.utils;

import com.azm.apihub.integrations.entities.IntegrationLogs;
import com.azm.apihub.integrations.entities.Request;
import com.azm.apihub.integrations.entities.Response;
import com.azm.apihub.integrations.exceptions.BadRequestException;

import com.azm.apihub.integrations.exceptions.InternalServerException;
import com.azm.apihub.integrations.simah.ce.models.request.ConsumerEnquiryRequest;
import com.fasterxml.jackson.core.JsonProcessingException;
import java.io.BufferedReader;
import java.io.StringWriter;
import java.util.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.experimental.UtilityClass;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;

@UtilityClass
@Slf4j
public class IntegrationUtils {
    public void checkRequestErrors(BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            List<String> errorMessages = new ArrayList<>();
            for (FieldError error : bindingResult.getFieldErrors()) {
                if (error.getDefaultMessage() != null && error.getDefaultMessage().trim().length() > 0) {
                    errorMessages.add(error.getDefaultMessage());
                } else {
                    errorMessages.add("Missing parameters: " + String.format("%s is required.", error.getField()));
                }
            }
            throw new BadRequestException(String.join(", ", errorMessages));
        }
    }

    public String getUriWithoutPathVariables(String requestUri) {
        String[] uriParts = requestUri.split("/");

        int requiredLength = Math.min(uriParts.length, 3);
        StringBuilder serviceNameBuilder = new StringBuilder(uriParts[1]);

        for (int i = 2; i < requiredLength; i++) {
            serviceNameBuilder.append("/").append(uriParts[i]);
        }

        return serviceNameBuilder.toString();
    }

    public String getServiceHeadNameFromMockService(String queryString) {
        // Split the query string into individual parameters
        String[] params = queryString.split("&");
        for (String param : params) {
            // Tokenize each parameter based on the '=' character
            String[] keyValue = param.split("=");
            // Check if the parameter name is "serviceHandle"
            if (keyValue.length == 2 && keyValue[0].equals("serviceHandle")) {
                return keyValue[1];
            }
        }
        return null;
    }


    public Map<String, String> extractHeaders(HttpServletRequest request) {
        Map<String, String> headers = new HashMap<>();
        Enumeration<String> headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String headerName = headerNames.nextElement();
            headers.put(headerName, request.getHeader(headerName));
        }
        return headers;
    }

    public Map<String, String> extractHeaders(HttpServletResponse response) {
        Map<String, String> headers = new HashMap<>();
        for (String headerName : response.getHeaderNames()) {
            headers.put(headerName, response.getHeader(headerName));
        }
        return headers;
    }

    public Map<String, String> extractRequestBody(HttpServletRequest request) throws Exception {
        Map<String, String> requestBodyMap = new HashMap<>();
        String contentType = request.getContentType();
        ObjectMapper objectMapper = new ObjectMapper();
        if (contentType != null && contentType.contains("application/json")) {
            // Read the request body
            StringBuilder requestBodyBuilder = new StringBuilder();
            BufferedReader reader = request.getReader();
            String line;
            while ((line = reader.readLine()) != null) {
                requestBodyBuilder.append(line);
            }
            // Convert JSON string to map
            requestBodyMap = objectMapper.readValue(requestBodyBuilder.toString(), Map.class);
        }

        return requestBodyMap;
    }

    private Map getBody(String bodyStr) throws JsonProcessingException {
        Map reqBody = null;
        // Convert the body string to a Map if it's not empty
        if (bodyStr != null && !bodyStr.isEmpty()) {
            ObjectMapper objectMapper = new ObjectMapper();
            reqBody = objectMapper.readValue(bodyStr, Map.class);
        }
        return  reqBody;
    }

    public IntegrationLogs setRequestAndResponse(HttpServletRequest httpRequest, HttpServletResponse httpResponse,
                                                 String requestBody, String responseBody, String serviceName,
                                                 long serviceHead, String attributeName, long requestTime, long responseTime) throws Exception {

        IntegrationLogs requestResponseLogs = new IntegrationLogs();
        UUID requestUuid = UUID.randomUUID();
        httpRequest.setAttribute(attributeName, requestUuid);

        log.info("SetRequestAndResponse Function  => Response Status: " + httpResponse.getStatus() + " with request uuid: " + requestUuid);

        String completeURL = httpRequest.getRequestURL().toString();
        String queryString = httpRequest.getQueryString();
        String parametersMap = convertRequestParametersMapToString(httpRequest.getParameterMap());

        if (queryString != null) {
            // Append the query string to the complete URL if it exists
            completeURL += "?" + queryString;
        }


        // Setting the Request details
        Request requestLog = new Request();
        requestLog.setMethod(httpRequest.getMethod());
        requestLog.setUrl(httpRequest.getRequestURL().toString());
        requestLog.setParameters(queryString != null ? queryString : parametersMap);
        requestLog.setHeaders(IntegrationUtils.extractHeaders(httpRequest)); // Extract and set request headers
        requestResponseLogs.setRequestTime(new Date(requestTime));

        //Set request body if no parameter was found
        if(parametersMap.isBlank()) {
            Map reqBody = getBody(requestBody);
            requestLog.setBody(reqBody != null ? reqBody : extractRequestBody(httpRequest));
        }

        // Setting the Response details
        Response responseLog = new Response();
        responseLog.setStatus(httpResponse.getStatus());
        responseLog.setHeaders(IntegrationUtils.extractHeaders(httpResponse));
        requestResponseLogs.setResponseTime(new Date(responseTime));

        responseLog.setBody(responseBody);

        // Setting the data/logs to be saved in the Mongo DB
        requestResponseLogs.setId(String.valueOf(requestUuid));
        requestResponseLogs.setServiceHead(serviceHead);
        requestResponseLogs.setService(serviceName);
        requestResponseLogs.setUrl(completeURL);
        requestResponseLogs.setRequest(requestLog);
        requestResponseLogs.setResponse(responseLog);

        log.info("Build request and response data to log into db");
        return requestResponseLogs;
    }

    private String convertRequestParametersMapToString(Map<String, String[]> requestParameter) {
        StringBuilder stringBuilder = new StringBuilder();

        if(requestParameter != null) {
            // Iterate over the parameterMap to access the parameters
            for (Map.Entry<String, String[]> entry : requestParameter.entrySet()) {
                String paramName = entry.getKey();
                String[] paramValues = entry.getValue();

                // Append parameter name
                stringBuilder.append(paramName).append("=");

                // Append parameter values
                for (int i = 0; i < paramValues.length; i++) {
                    stringBuilder.append(paramValues[i]);
                    if (i < paramValues.length - 1) {
                        stringBuilder.append(",");
                    }
                }

                // Append a comma to separate parameters
                stringBuilder.append(", ");
            }
        }
        return stringBuilder.toString();
    }

    public static String generateCurl(String url, HttpHeaders headers, HttpMethod method, String requestBody) {
        StringBuilder curlBuilder = new StringBuilder("curl -X ").append(method.toString()).append(" '").append(url).append("'");

        // Append headers to the curl command
        if (headers != null) {
            for (Map.Entry<String, List<String>> entry : headers.entrySet()) {
                String headerName = entry.getKey();
                List<String> headerValues = entry.getValue();
                for (String headerValue : headerValues) {
                    curlBuilder.append(" -H '").append(headerName).append(": ").append(headerValue).append("'");
                }
            }
        }

        // Append request body to the curl command
        if (requestBody != null && !requestBody.isEmpty()) {
            curlBuilder.append(" -d '").append(requestBody.replace("'", "'\\''")).append("'");
        }

        return curlBuilder.toString();
    }

    public static String convertToXML(ConsumerEnquiryRequest consumerEnquiryRequest) {

        String xmlString = "";
        try {
            JAXBContext jaxbContext = JAXBContext.newInstance(ConsumerEnquiryRequest.class);

            Marshaller marshaller = jaxbContext.createMarshaller();
            marshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, true);

            StringWriter sw = new StringWriter();
            marshaller.marshal(consumerEnquiryRequest, sw);
            xmlString = sw.toString();

            log.info("JSON converted to XML:\n " + xmlString);
        } catch (JAXBException e) {
            throw new InternalServerException("Something wrong happened. Please contact our support team if the issue persists.");
        }
        return xmlString;
    }
}
