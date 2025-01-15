package com.azm.apihub.integrations.callbackLogs.repositories;

import com.azm.apihub.integrations.callbackLogs.entities.CallbackLogs;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface CallbackLogsRepository extends MongoRepository<CallbackLogs, String> {
}
