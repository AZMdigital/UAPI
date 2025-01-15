package com.azm.apihub.integrations.baseServices.dto;

public class ApiKeyCredentials {

    private final String apiKey;

    public ApiKeyCredentials(String apiKey) {
        this.apiKey = apiKey;
    }

    public String getApiKey() {
        return apiKey;
    }
}



