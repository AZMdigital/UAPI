package com.azm.apihub.integrations;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.scheduling.annotation.EnableScheduling;

@OpenAPIDefinition(info = @Info(title = "API HUB Integrations", version = "1.0.0", description = "Unified Application Programming Interface"))
@Slf4j
@SpringBootApplication
@EnableAspectJAutoProxy(proxyTargetClass = true)
@EnableScheduling
public class ApiHubApplication {

    public static void main(String[] args) {
        SpringApplication.run(ApiHubApplication.class, args);
        log.info("API-HUB Integrations started.");
    }
}
