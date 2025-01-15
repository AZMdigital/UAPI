package com.azm.apihub.backend.utilities.exception;


import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class WathqException extends RuntimeException {

    private final HttpStatus code;
    private String errorCode;

    public WathqException(HttpStatus code, String errorCode, String message) {
        super(message);
        this.code = code;
        this.errorCode = errorCode;
    }
}