package com.azm.apihub.integrations.repository;

import com.azm.apihub.integrations.entities.IntegrationLogs;
import org.springframework.data.mongodb.repository.MongoRepository;

/**
 * @author Bashar Al-Shoubaki
 * @created 29/01/2024
 */
public interface IntegrationLogsRepository extends MongoRepository<IntegrationLogs, String> {
}
