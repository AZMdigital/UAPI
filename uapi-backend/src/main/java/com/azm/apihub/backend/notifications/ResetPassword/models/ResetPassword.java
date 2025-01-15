package com.azm.apihub.backend.notifications.ResetPassword.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ResetPassword {
    private String email;
    private String password;
    private String token;
}

