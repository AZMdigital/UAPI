package com.azm.apihub.integrations.configuration.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class IntegrationTokenResponse {
    String token;
    String refreshToken;
    Long validity;
    Long refreshValidity;
    String tokenType;
}