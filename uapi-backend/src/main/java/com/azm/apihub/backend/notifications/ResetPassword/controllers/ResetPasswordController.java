package com.azm.apihub.backend.notifications.ResetPassword.controllers;

import com.azm.apihub.backend.ApiHubUtils;
import com.azm.apihub.backend.notifications.ResetPassword.models.ResetPassword;
import com.azm.apihub.backend.notifications.ResetPassword.services.ResetPasswordService;
import com.azm.apihub.backend.notifications.ResetPassword.validator.ResetPasswordValidator;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;


@RestController
@RequestMapping("/v1/forgot-password")
@Tag(name = "Forgot password")
@AllArgsConstructor
@Slf4j
public class ResetPasswordController {

    @Autowired
    ResetPasswordService resetPasswordService;

    @Autowired
    ResetPasswordValidator resetPasswordValidator;

    @PostMapping
    @Operation(
            summary = "This Api is used to send email of resetting password to user",
            parameters = {
                    @Parameter(name = "email", description = "The email of the user"),
            }
    )

    public ResponseEntity<HttpStatus> forgotPassword(@RequestParam(name = "email") String email,
                                                               HttpServletRequest httpServletRequest) {
        var startMillis = System.currentTimeMillis();
        UUID requestID = UUID.randomUUID();
        log.info("Request received for sending email to reset password to this email:" +email+ " with requestId:"+requestID);

        resetPasswordService.sendResetPasswordEmail(requestID, email, httpServletRequest);

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Send reset password email service took " + timeTook + " ms");

        return new ResponseEntity<>(HttpStatus.OK);

    }

    @PostMapping(value = "/validate")
    @Operation(
            summary = "This Api is used to validate token of reset password",
            parameters = {
                    @Parameter(name = "email", description = "The email of the user"),
                    @Parameter(name = "token", description = "The generated token of the user for resetting password"),
            }
    )

    public ResponseEntity<HttpStatus> validateToken(@RequestParam(name = "email") String email,
                                                    @RequestParam(name = "token") String token) {
        var startMillis = System.currentTimeMillis();
        UUID requestID = UUID.randomUUID();
        log.info("Request received for validating token with requestId:"+requestID);

        resetPasswordService.validateToken(email, token);

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("validate token service took " + timeTook + " ms");

        return new ResponseEntity<>(HttpStatus.OK);

    }

    @PostMapping(value = "/reset")
    @Operation(
            summary = "This Api is used to reset password of user"
    )

    public ResponseEntity<HttpStatus> resetPassword(@RequestBody @Validated ResetPassword resetPassword,
                                                    BindingResult bindingResult, HttpServletRequest httpServletRequest) {
        var startMillis = System.currentTimeMillis();
        UUID requestID = UUID.randomUUID();
        log.info("Request received for resetting password with requestId:"+requestID);

        resetPasswordValidator.validate(resetPassword, bindingResult);
        ApiHubUtils.checkRequestErrors(bindingResult);

        resetPasswordService.resetPassword(requestID, resetPassword, httpServletRequest);

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Reset password service took " + timeTook + " ms");

        return new ResponseEntity<>(HttpStatus.OK);

    }
}
