package com.azm.apihub.integrations.exceptions;

import com.azm.apihub.integrations.contracts.exception.ContractsErrorResponse;
import com.azm.apihub.integrations.contracts.exception.ContractsException;
import com.azm.apihub.integrations.edaat.exception.EdaatErrorDetails;
import com.azm.apihub.integrations.edaat.exception.EdaatException;
import com.azm.apihub.integrations.etimad.exceptions.EtimadException;
import com.azm.apihub.integrations.masdr.mofeed.exceptions.MofeedErrorDetail;
import com.azm.apihub.integrations.masdr.mofeed.exceptions.MofeedException;
import com.azm.apihub.integrations.msegat.exception.MsegatErrorDetails;
import com.azm.apihub.integrations.msegat.exception.MsegatException;
import com.azm.apihub.integrations.neotek.exception.NeotekError;
import com.azm.apihub.integrations.neotek.exception.NeotekException;
import com.azm.apihub.integrations.tcc.exception.NafathError;
import com.azm.apihub.integrations.tcc.exception.NafathException;
import com.azm.apihub.integrations.tcc.exception.TccException;
import com.azm.apihub.integrations.unifonic.exception.UnifonicErrorDetails;
import com.azm.apihub.integrations.unifonic.exception.UnifonicException;
import com.azm.apihub.integrations.utils.IntegrationConstants;
import com.azm.apihub.integrations.wathq.exception.Error;
import com.azm.apihub.integrations.wathq.exception.WathqException;
import com.azm.apihub.integrations.yakeen.exception.YakeenError;
import com.azm.apihub.integrations.yakeen.exception.YakeenException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
@Slf4j
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    private static final String INTERNAL_SERVER_EXCEPTION = "Something went wrong in uApiHub. Please contact our support team if the issue persists.";

    @ExceptionHandler(value = { Exception.class })
    protected ResponseEntity<ErrorResponse> handleGlobalException(Exception ex) {
        logger.error("Internal server error: "+ex);
        GlobalExceptionHandlerHolder.setException(IntegrationConstants.UAPIErrorCodes.U_API_INTERNAL_SERVER_ERROR, ex);
        return new ResponseEntity<>(
                new ErrorResponse(INTERNAL_SERVER_EXCEPTION),
                HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(value = { InternalServerException.class })
    protected ResponseEntity<ErrorResponse> handleInternalServerError(InternalServerException ex) {
        logger.error("Internal server error: "+ex);
        GlobalExceptionHandlerHolder.setException(IntegrationConstants.UAPIErrorCodes.U_API_INTERNAL_SERVER_ERROR, ex);
        return new ResponseEntity<>(
                new ErrorResponse(ex.getMessage()),
                HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(value = { BadRequestException.class })
    protected ResponseEntity<ErrorResponse> handleBadRequestException(BadRequestException ex) {
        logger.error("Bad request: "+ex);
        GlobalExceptionHandlerHolder.setException(IntegrationConstants.UAPIErrorCodes.U_API_BAD_REQUEST, ex);
        return new ResponseEntity<>(
                new ErrorResponse(ex.getMessage()),
                HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(value = { UnAuthorizedException.class })
    protected ResponseEntity<ErrorResponse> handleUnAuthorizedException(UnAuthorizedException ex) {
        logger.error("UnAuthorzied exception occurred: "+ex);
        GlobalExceptionHandlerHolder.setException(IntegrationConstants.UAPIErrorCodes.U_API_UNAUTHORIZED, ex);
        return new ResponseEntity<>(
                new ErrorResponse(ex.getMessage()),
                HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(value = { WathqException.class })
    protected ResponseEntity<Error> handleWathqException(WathqException ex) {
        logger.error("Wathq Exception occurred: "+ex.getMessage());
        GlobalExceptionHandlerHolder.setException(ex.getErrorCode(), ex);
        return new ResponseEntity<>(
                new Error(ex.getErrorCode(), ex.getMessage()),
                ex.getCode());
    }

    @ExceptionHandler(value = { TccException.class })
    protected ResponseEntity<Error> handleTccException(TccException ex) {
        logger.error("TCC Exception occurred: "+ex.getMessage());
        GlobalExceptionHandlerHolder.setException(ex.getErrorCode(), ex);
        return new ResponseEntity<>(
                new Error(ex.getErrorCode(), ex.getMessage()),
                ex.getCode());
    }

    @ExceptionHandler(value = { HttpClientErrorException.class })
    protected ResponseEntity<String> handleHttpClientErrorException(HttpClientErrorException ex) {
        logger.error("Bad request exception occurred: "+ex.getMessage());
        GlobalExceptionHandlerHolder.setException(ex.getStatusCode().toString(), ex);

        return ResponseEntity.status(ex.getStatusCode())
                .contentType(MediaType.APPLICATION_JSON)
                .body(ex.getStatusText());
    }

    @ExceptionHandler(value = { YakeenException.class })
    protected ResponseEntity<YakeenError> handleYakeenException(YakeenException ex) {
        logger.error("Yakeen Exception occurred: "+ex.getMessage());
        GlobalExceptionHandlerHolder.setException(ex.getYakeenError().getErrorDetail().getErrorCode(), ex);
        return new ResponseEntity<>(
                ex.getYakeenError(),
                ex.getCode());
    }

    @ExceptionHandler(value = { NafathException.class })
    protected ResponseEntity<NafathError> handleNafathException(NafathException ex) {
        logger.error("TCC Nafath Exception occurred: "+ex.getMessage());
        GlobalExceptionHandlerHolder.setException(ex.getNafathError().getStatus(), ex);
        return new ResponseEntity<>(
                ex.getNafathError(),
                ex.getCode());
    }

    @ExceptionHandler(value = { UnifonicException.class })
    protected ResponseEntity<UnifonicErrorDetails> handleUnifonicException(UnifonicException ex) {
        logger.error("Unifonic Exception occurred: "+ex.getMessage());
        GlobalExceptionHandlerHolder.setException(ex.getUnifonicErrorDetails().getErrorCode(), ex);
        return new ResponseEntity<>(
                ex.getUnifonicErrorDetails(),
                ex.getCode());
    }

    @ExceptionHandler(value = { MsegatException.class })
    protected ResponseEntity<MsegatErrorDetails> handleMsegatException(MsegatException ex) {
        logger.error("Msegat Exception occurred: "+ex.getMessage());
        GlobalExceptionHandlerHolder.setException(ex.getMsegatErrorDetails().getCode(), ex);
        return new ResponseEntity<>(
                ex.getMsegatErrorDetails(),
                ex.getCode());
    }

    @ExceptionHandler(value = { EdaatException.class })
    protected ResponseEntity<EdaatErrorDetails> handleEdaatException(EdaatException ex) {
        logger.error("Edaat Exception occurred: "+ex.getMessage());
        GlobalExceptionHandlerHolder.setException(ex.getEdaatErrorDetails().getError(), ex);
        return new ResponseEntity<>(
                ex.getEdaatErrorDetails(),
                ex.getCode());
    }

    @ExceptionHandler(value = { ContractsException.class })
    protected ResponseEntity<ContractsErrorResponse> handleContractsException(ContractsException ex) {
        logger.error("Contracts Exception occurred: "+ex.getMessage());
        GlobalExceptionHandlerHolder.setException(ex.getContractsErrorResponse().getTitle(), ex);
        return new ResponseEntity<>(
                ex.getContractsErrorResponse(),
                ex.getCode());
    }


    @Override
    @SuppressWarnings("NullableProblems")
    protected ResponseEntity<Object> handleMissingServletRequestParameter(@NonNull MissingServletRequestParameterException ex,
                                                                          @NonNull HttpHeaders headers,
                                                                          @NonNull HttpStatus status,
                                                                          @NonNull WebRequest request) {
        GlobalExceptionHandlerHolder.setException(IntegrationConstants.UAPIErrorCodes.U_API_BAD_REQUEST, ex);
        return new ResponseEntity<>(
                new ErrorResponse(ex.getMessage()),
                HttpStatus.BAD_REQUEST);
    }


    @ExceptionHandler(value = { ForbiddenException.class })
    protected ResponseEntity<ErrorResponse> handleForbiddenException(ForbiddenException ex) {
        logger.error("Forbidden: "+ex.getMessage());
        GlobalExceptionHandlerHolder.setException(IntegrationConstants.UAPIErrorCodes.U_API_FORBIDDEN, ex);
        return new ResponseEntity<>(
                new ErrorResponse(ex.getMessage()), HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(value = { EtimadException.class })
    protected ResponseEntity<com.azm.apihub.integrations.etimad.exceptions.ErrorResponse> handleEtimadException(EtimadException ex) {
        logger.error("Etimad Exception occurred: "+ex.getMessage());
        GlobalExceptionHandlerHolder.setException(ex.getErrorResponse().getErrors().get(0).getCode(), ex);
        return new ResponseEntity<>(
                ex.getErrorResponse(),
                ex.getCode());
    }

    @ExceptionHandler(value = { MofeedException.class })
    protected ResponseEntity<MofeedErrorDetail> handleMofeedException(MofeedException ex) {
        logger.error("Mofeed Exception occurred: "+ex.getMessage());
        GlobalExceptionHandlerHolder.setException(ex.getErrorDetail().getErrorCode(), ex);
        return new ResponseEntity<>(
                ex.getErrorDetail(),
                ex.getCode());
    }

    @ExceptionHandler(value = { NotFoundException.class })
    protected ResponseEntity<ErrorResponse> handleNotFoundException(NotFoundException ex) {
        logger.error("Not found: "+ex.getMessage());
        GlobalExceptionHandlerHolder.setException(IntegrationConstants.UAPIErrorCodes.U_API_NOT_FOUND, ex);
        return new ResponseEntity<>(
                new ErrorResponse(ex.getMessage()), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(HttpServerErrorException.class)
    public ResponseEntity<String> handleHttpServerErrorException(HttpServerErrorException ex) {
        String responseBody = ex.getResponseBodyAsString();

        logger.error("Server exception occurred: "+ex.getMessage());
        return ResponseEntity.status(ex.getStatusCode())
                .contentType(MediaType.APPLICATION_JSON)
                .body(responseBody);
    }

    @ExceptionHandler(value = { NeotekException.class })
    protected ResponseEntity<NeotekError> handleNeotekException(NeotekException ex) {
        logger.error("Neotek Exception occurred : " + ex.getMessage());
        GlobalExceptionHandlerHolder.setException(ex.getNeotekError().getErrors().get(0).getMessage(), ex);
        return new ResponseEntity<>(
                ex.getNeotekError(),
                ex.getCode());
    }

}
