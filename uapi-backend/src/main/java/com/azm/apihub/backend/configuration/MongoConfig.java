package com.azm.apihub.backend.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@Configuration
@EnableMongoRepositories(basePackages = {
        "com.azm.apihub.backend.utilities.repository",
        "com.azm.apihub.backend.integrationLogs.repository",
        "com.azm.apihub.backend.audit.repository",
        "com.azm.apihub.backend.callbackLogs.repository"})
public class MongoConfig {
}
