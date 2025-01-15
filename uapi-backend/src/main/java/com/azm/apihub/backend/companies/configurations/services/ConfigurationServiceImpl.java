package com.azm.apihub.backend.companies.configurations.services;

import com.azm.apihub.backend.companies.configurations.repositoriy.ConfigurationRepository;
import com.azm.apihub.backend.entities.Configuration;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Slf4j
@Service
public class ConfigurationServiceImpl implements ConfigurationService {

    @Autowired
    private ConfigurationRepository configurationRepository;

    @Override
    public List<Configuration> findAllConfiguration() {
        return configurationRepository.findAll();
    }
}
