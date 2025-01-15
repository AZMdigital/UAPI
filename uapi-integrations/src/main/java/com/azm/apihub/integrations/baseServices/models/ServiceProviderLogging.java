package com.azm.apihub.integrations.baseServices.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ServiceProviderLogging {
    private Long id;
    private Long serviceProviderId;
    private ServiceProvider serviceProvider;
}