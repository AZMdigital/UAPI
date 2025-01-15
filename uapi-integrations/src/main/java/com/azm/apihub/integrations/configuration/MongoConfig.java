package com.azm.apihub.integrations.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@Configuration
@EnableMongoRepositories(basePackages = {
        "com.azm.apihub.integrations.repository",
        "com.azm.apihub.integrations.callbackLogs.repositories"})
public class MongoConfig {
}
