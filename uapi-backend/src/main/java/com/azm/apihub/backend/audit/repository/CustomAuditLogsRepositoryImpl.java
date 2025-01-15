package com.azm.apihub.backend.audit.repository;

import com.azm.apihub.backend.audit.entities.AuditLogs;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class CustomAuditLogsRepositoryImpl implements CustomAuditLogsRepository {

    @Autowired
    private MongoTemplate mongoTemplate;

    @Override
    public List<String> findDistinctUpdatedByUsernames() {
        Query query = new Query();
        return mongoTemplate.query(AuditLogs.class)
                .distinct("updatedByUserName")
                .matching(query)
                .as(String.class)
                .all();
    }
}
