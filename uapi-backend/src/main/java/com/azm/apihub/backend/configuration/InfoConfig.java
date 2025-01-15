package com.azm.apihub.backend.configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.actuate.info.InfoContributor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class InfoConfig {

    @Value("${info.app.name}") String appName;
    @Value("${app.version}") String appVersion;
    @Value("${info.app.java.version}") String javaVersion;

    @Bean
    public InfoContributor customInfoContributor() {
        return builder -> {
            builder.withDetail("app.name", appName)
                   .withDetail("app.version", appVersion)
                   .withDetail("app.java.version", javaVersion);
        };
    }
}
