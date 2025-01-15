package com.azm.apihub.backend.users.models;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserTokenResponse {
    String token;
    String refreshToken;
    Long validity;
    Long refreshValidity;
    String tokenType;
}