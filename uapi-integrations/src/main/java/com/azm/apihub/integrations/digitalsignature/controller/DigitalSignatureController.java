package com.azm.apihub.integrations.digitalsignature.controller;

import com.azm.apihub.integrations.digitalsignature.enums.ApiTag;
import com.azm.apihub.integrations.digitalsignature.models.*;
import com.azm.apihub.integrations.digitalsignature.services.ApiSignatureHandler;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/digital-signature")
@Tag(name = "Digital Signature")
@AllArgsConstructor
@Slf4j
public class DigitalSignatureController {

    @Autowired
    private ApiSignatureHandler apiSignatureHandler;

    @PostMapping("/sign")
    public ResponseEntity<SigningResponse> securedCreateCompanyEndpoint(@RequestBody SigningRequest request) {

        log.info("Request received for Signing data");

        String encodedSignedData = apiSignatureHandler.processRequestForSigning(request);

        log.info("Completing signing Request");
        return new ResponseEntity<>(new SigningResponse(encodedSignedData),
                encodedSignedData != null ? HttpStatus.OK : HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifySignature(@RequestBody VerifyRequest request) {
        log.info("Request received for Verifying Signing data");
        apiSignatureHandler.verifyRequestSignature(request.getSignature(), request.getData(), request.getTag());
        log.info("Finished verify request Signature");
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
