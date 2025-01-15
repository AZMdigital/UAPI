package com.azm.apihub.integrations.digitalsignature.services;

import com.azm.apihub.integrations.baseServices.BaseService;
import com.azm.apihub.integrations.baseServices.dto.CompanyConfiguration;
import com.azm.apihub.integrations.digitalsignature.enums.ApiTag;
import com.azm.apihub.integrations.digitalsignature.models.SigningRequest;
import com.azm.apihub.integrations.digitalsignature.models.VerifyRequest;
import com.azm.apihub.integrations.digitalsignature.utils.DigitalSignatureUtils;
import com.azm.apihub.integrations.exceptions.BadRequestException;
import com.azm.apihub.integrations.exceptions.ForbiddenException;
import java.util.Base64;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class ApiSignatureHandlerImpl extends BaseService implements ApiSignatureHandler {

    @Autowired
    DigitalSignatureService digitalSignatureService;

    @Override
    public String processRequestForSigning(SigningRequest request) {
        String encodedSignedData = null;
        try {
        ApiTag tag = ApiTag.valueOf(request.getTag().name());
        Object requestDataObject = DigitalSignatureUtils.getCustomObject(request.getData(), tag.getAssociatedClass());
        var requestData = DigitalSignatureUtils.convertToJsonString(requestDataObject);

        byte[] signedData = digitalSignatureService.sign(requestData.getBytes());

        encodedSignedData = Base64.getEncoder().encodeToString(signedData);

        } catch (Exception e) {
            return null;
        }
        return encodedSignedData;
    }

    @Override
    public void verifyRequestSignature(String signatureBase64, Object object, ApiTag apiTag) {
        try {
            boolean isValid = processRequestForVerifying(new VerifyRequest(object, signatureBase64, apiTag));
            if(!isValid)
                throw new ForbiddenException("Provided request signature is not valid");
        } catch (Exception e) {
            throw new BadRequestException("Verification failed: "+e.getMessage());
        }
    }

    private boolean processRequestForVerifying(VerifyRequest request) throws Exception {
        CompanyConfiguration companyConfiguration = getCompanyConfiguration("DIGITAL_SIGNATURE");
        if(companyConfiguration == null) {
            log.info("Skipping signature verification because configuration for this company is not configured yet");
            return true;
        }

        if(companyConfiguration.getConfigValue().equalsIgnoreCase("true") && request.getSignature() == null)
            throw new BadRequestException("Please add request X-Signature in header");

        if(companyConfiguration.getConfiguration().getType().equalsIgnoreCase("boolean")
                && companyConfiguration.getConfigValue().equalsIgnoreCase("true")) {
            ApiTag tag = ApiTag.valueOf(request.getTag().name());
            Object requestDataObject = DigitalSignatureUtils.getCustomObject(request.getData(), tag.getAssociatedClass());
            return DigitalSignatureUtils.verifyRequestSignature(request.getSignature(), requestDataObject, digitalSignatureService);
        } else {
            log.info("Skipping digital signature verification because user has disable this.");
            return true;
        }
    }
}