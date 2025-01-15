package com.azm.apihub.backend.integrationLogs.repository;

import com.azm.apihub.backend.entities.integrationLogs.IntegrationRequestLogs;
import java.time.LocalDate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface IntegrationRequestLogsRepository extends MongoRepository<IntegrationRequestLogs, String> {

    @Query("{$and: [ " +
            "{ 'accountId' : ?0 }, " +
            "{ $or: [ { $expr: { $eq: ['?1', 'null'] } } , { 'service' : ?1 } ] }, " +
            "{ $or: [ { $expr: { $eq: ['?2', 'null'] } } , { 'requestTime' : { $gte: ?2, $lt: ?3 } } ] }, " +
            "{ $or: [ { $expr: { $eq: ['?4', 'null'] } } , { 'response.status' : { $gte: ?4, $lt: ?5 } } ] } " +
            "] }")
    Page<IntegrationRequestLogs> getSearchResult(Long accountId, String serviceName, LocalDate fromDate,
                                                 LocalDate toDate, Integer statusLower, Integer statusUpper, Pageable pageable);
}
