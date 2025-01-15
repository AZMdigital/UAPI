package com.azm.apihub.backend;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.scheduling.annotation.EnableScheduling;

@OpenAPIDefinition(info = @Info(title = "API HUB BACKEND", version = "2.0", description = "api-hub-backend endpoints"))
@SpringBootApplication
@EnableScheduling
@Slf4j
@EnableAspectJAutoProxy(proxyTargetClass = true)
public class ApiHubBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(ApiHubBackendApplication.class, args);
        log.info("API-HUB Backend service started.");
    }

}
