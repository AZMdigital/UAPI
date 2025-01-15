package com.azm.apihub.backend.utilities.repository;

import com.azm.apihub.backend.entities.integrationLogs.IntegrationLogs;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface IntegrationLogsRepository extends MongoRepository<IntegrationLogs, String> {

    List<IntegrationLogs> findAllByAccountIdAndServiceAndResponseBodyDeedDetailsDeedNumber(Long accountId, String serviceName, String deedNumber);
}
