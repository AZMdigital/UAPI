package com.azm.apihub.backend.exceptions;

import com.azm.apihub.backend.utilities.exception.Error;
import com.azm.apihub.backend.utilities.exception.WathqException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
@Slf4j
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(value = { Exception.class })
    protected ResponseEntity<ErrorResponse> handleInternalServerError(Exception ex) {
        logger.error("Internal server error: ", ex);
        return new ResponseEntity<>(
                new ErrorResponse("Something wrong happened. Please contact our support team if the issue persists."),
                HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(value = { BadRequestException.class })
    protected ResponseEntity<ErrorResponse> handleBadRequestException(BadRequestException ex) {
        logger.error("Bad request: ", ex);
        return new ResponseEntity<>(
                new ErrorResponse(ex.getMessage()),
                HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(value = { UnAuthorizedException.class })
    protected ResponseEntity<ErrorResponse> handleUnAuthorizedException(UnAuthorizedException ex) {
        logger.error("UnAuthorzied exception occurred: ", ex);
        return new ResponseEntity<>(
                new ErrorResponse(ex.getMessage()),
                HttpStatus.UNAUTHORIZED);
    }

    @Override
    @SuppressWarnings("NullableProblems")
    protected ResponseEntity<Object> handleMissingServletRequestParameter(@NonNull MissingServletRequestParameterException ex,
                                                                          @NonNull HttpHeaders headers,
                                                                          @NonNull HttpStatus status,
                                                                          @NonNull WebRequest request) {
        return new ResponseEntity<>(
                new ErrorResponse(ex.getMessage()),
                HttpStatus.BAD_REQUEST);
    }

    //Keycloak exceptions
    @ExceptionHandler(value = { javax.ws.rs.BadRequestException.class })
    protected ResponseEntity<ErrorResponse> handleKeyCloakBadRequestException(javax.ws.rs.BadRequestException ex) {
        logger.error("Keycloak Bad request: ", ex);
        return new ResponseEntity<>(
                new ErrorResponse(ex.getMessage()),
                HttpStatus.BAD_REQUEST);
    }

    //Keycloak exceptions
    @ExceptionHandler(value = { javax.ws.rs.NotAuthorizedException.class })
    protected ResponseEntity<ErrorResponse> handleKeyCloakNotAuthorizedException(javax.ws.rs.NotAuthorizedException ex) {
        logger.error("Keycloak Not Authorised exception: ", ex);
        return new ResponseEntity<>(
                new ErrorResponse(ex.getMessage()),
                HttpStatus.UNAUTHORIZED);
    }

    //Keycloak exceptions
    @ExceptionHandler(value = { javax.ws.rs.ForbiddenException.class })
    protected ResponseEntity<ErrorResponse> handleKeyCloakNotForbiddenException(javax.ws.rs.ForbiddenException ex) {
        logger.error("Keycloak Forbidden exception: ", ex);
        return new ResponseEntity<>(
                new ErrorResponse(ex.getMessage()),
                HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(value = { NotFoundException.class })
    protected ResponseEntity<ErrorResponse> handleNotFoundException(NotFoundException ex) {
        logger.error("Not found: ", ex);
        return new ResponseEntity<>(
                new ErrorResponse(ex.getMessage()), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(value = { WathqException.class })
    protected ResponseEntity<Error> handleWathqException(WathqException ex) {
        logger.error("Wathq Exception occurred: ",ex);
        return new ResponseEntity<>(
                new Error(ex.getErrorCode(), ex.getMessage()),
                ex.getCode());
    }

    @ExceptionHandler(value = { ForbiddenException.class })
    protected ResponseEntity<ErrorResponse> handleForbiddenExceptionException(ForbiddenException ex) {
        logger.error("You do not have access exception: ", ex);
        return new ResponseEntity<>(
                new ErrorResponse(ex.getMessage()),
                HttpStatus.FORBIDDEN);
    }

}
