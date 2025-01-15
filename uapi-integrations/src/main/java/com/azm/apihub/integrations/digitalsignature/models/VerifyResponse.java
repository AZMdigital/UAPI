package com.azm.apihub.integrations.digitalsignature.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class VerifyResponse {
    private boolean isValid;
    private String message;
}