package com.azm.apihub.backend.companies.configurations.services;

import com.azm.apihub.backend.entities.Configuration;
import java.util.List;


public interface ConfigurationService {
    List<Configuration> findAllConfiguration();
}
