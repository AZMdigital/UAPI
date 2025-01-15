package com.azm.apihub.integrations.digitalsignature.models;

import com.azm.apihub.integrations.digitalsignature.enums.ApiTag;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class VerifyRequest {
    private Object data;
    private String signature;
    private ApiTag tag;
}