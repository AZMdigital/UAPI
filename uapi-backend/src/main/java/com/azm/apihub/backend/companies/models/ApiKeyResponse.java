package com.azm.apihub.backend.companies.models;

import com.azm.apihub.backend.entities.ApiKey;
import com.azm.apihub.backend.users.models.UserRequest;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ApiKeyResponse {
    private ApiKey apiKey;
    private String message;
}