package com.azm.apihub.integrations.digitalsignature.annotations;

import com.azm.apihub.integrations.digitalsignature.enums.ApiTag;
import com.azm.apihub.integrations.digitalsignature.services.ApiSignatureHandler;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.validation.BindingResult;

import javax.servlet.http.HttpServletRequest;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Aspect
@Component
@Slf4j
public class ApiSignatureVerificationAspect {

    @Autowired
    private ApiSignatureHandler apiSignatureHandler;

    @Before("@annotation(enableApiSignatureVerification)")
    public void verifyApiSignature(JoinPoint joinPoint, EnableApiSignatureVerification enableApiSignatureVerification) {
        ApiTag apiTag = enableApiSignatureVerification.value();
        Object[] args = joinPoint.getArgs();
        String signatureBase64 = null;
        Object request = null;

        // Get the current request attributes
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes != null) {
            HttpServletRequest httpRequest = attributes.getRequest();
            signatureBase64 = (String) httpRequest.getAttribute("signatureBase64");
        }

        for (Object arg : args) {
            if (arg instanceof BindingResult)
                continue;

            if (!(arg instanceof HttpServletRequest))
                request = arg;
        }

        log.info("Verification Annotation called for API TAG: "+apiTag.name());
        apiSignatureHandler.verifyRequestSignature(signatureBase64, request, apiTag);
    }
}
