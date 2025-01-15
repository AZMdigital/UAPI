package com.azm.apihub.integrations.digitalsignature.services;

import com.azm.apihub.integrations.digitalsignature.enums.ApiTag;
import com.azm.apihub.integrations.digitalsignature.models.SigningRequest;

public interface ApiSignatureHandler {
    public String processRequestForSigning(SigningRequest request);
    public void verifyRequestSignature(String signatureBase64, Object object, ApiTag apiTag);
}
