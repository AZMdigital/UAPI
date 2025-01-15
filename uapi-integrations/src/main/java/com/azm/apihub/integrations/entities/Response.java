package com.azm.apihub.integrations.entities;

import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
public class Response {
    private Integer status;
    private Map<String, String> headers;
    private String body;

}
