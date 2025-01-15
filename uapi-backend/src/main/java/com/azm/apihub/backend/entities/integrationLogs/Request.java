package com.azm.apihub.backend.entities.integrationLogs;

import java.util.Map;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Request {

    private String url;
    private String method;
    private String parameters;
    private Map<String, String> headers;
    private Map<String, String> body;

}
