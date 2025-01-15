package com.azm.apihub.integrations.entities;

import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
public class Request {

    private String url;
    private String method;
    private String parameters;
    private Map<String, String> headers;
    private Map<String, String> body;

}
