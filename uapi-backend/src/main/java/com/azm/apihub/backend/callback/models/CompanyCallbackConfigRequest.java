package com.azm.apihub.backend.callback.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.NotBlank;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CompanyCallbackConfigRequest {
    @NotBlank(message = "please enter service Id")
    private Long serviceId;

    private Long companyId;

    @NotBlank(message = "please enter callback Url")
    private String callbackUrl;

    private String authHeaderKey;

    @NotBlank(message = "please enter Auth Header value")
    private String authHeaderValue;

    private String description;
    private Boolean isActive;
}
