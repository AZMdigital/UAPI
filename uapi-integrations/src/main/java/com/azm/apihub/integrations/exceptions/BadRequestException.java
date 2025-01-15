package com.azm.apihub.integrations.exceptions;

import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.BAD_REQUEST)
public class BadRequestException extends RuntimeException {

    @Getter
    @Setter
    private HttpStatus httpStatusCode;

    public BadRequestException(String message) {
        super(message);
    }

    public BadRequestException(HttpStatus httpStatusCode, String message) {
        super(message);
        this.httpStatusCode = httpStatusCode;
    }
}