package com.azm.apihub.backend.companies.configurations.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CompanyConfigurationRequest {
    Long configurationId;
    String configurationValue;
}