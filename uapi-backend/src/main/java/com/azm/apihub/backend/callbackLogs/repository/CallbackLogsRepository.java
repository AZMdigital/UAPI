package com.azm.apihub.backend.callbackLogs.repository;

import com.azm.apihub.backend.callbackLogs.entities.CallbackLogs;
import java.time.LocalDate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RequestParam;

@Repository
public interface CallbackLogsRepository extends MongoRepository<CallbackLogs, String> {

    @Query("{ '$and': [ "
            +"{ $or: [ { $expr: { $eq: ['?0', 'null'] } } , { 'serviceId' : ?0 } ] }, "
            + "{ $or: [ { $expr: { $eq: ['?1', 'null'] } } , { 'companyId' : ?1 } ] }, "
            +"{ $or: [ { $expr: { $eq: ['?2', 'null'] } } , { 'createdAt' : { $gte: ?2, $lt: ?3 } } ] } "
            + "] }")
    Page<CallbackLogs> findAllLogs(
            Long serviceId, Long companyId, LocalDate fromDate, LocalDate toDate, Pageable pageable, boolean applyPagination);
}
