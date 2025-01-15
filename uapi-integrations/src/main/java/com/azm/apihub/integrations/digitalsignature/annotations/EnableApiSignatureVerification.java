package com.azm.apihub.integrations.digitalsignature.annotations;

import com.azm.apihub.integrations.digitalsignature.enums.ApiTag;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface EnableApiSignatureVerification {
    ApiTag value();
}
