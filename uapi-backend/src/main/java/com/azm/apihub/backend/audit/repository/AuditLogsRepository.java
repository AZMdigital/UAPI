package com.azm.apihub.backend.audit.repository;

import com.azm.apihub.backend.audit.entities.AuditLogs;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface AuditLogsRepository extends MongoRepository<AuditLogs, String> {

    String queryStr = "{$and: [ " +
            "{ $or: [ { $expr: { $eq: ['?0', 'null'] } } , { 'updatedByCompanyId' : ?0 } ] }, " +
            "{ $or: [ { $expr: { $eq: ['?1', 'null'] } } , { 'updatedByUserName' : ?1 } ] }, " +
            "{ $or: [ { $expr: { $eq: ['?2', 'null'] } } , { 'moduleName' : ?2 } ] }, " +
            "{ $or: [ { $expr: { $eq: ['?3', 'null'] } } , { 'action' : ?3 } ] }, " +
            "{ $or: [ { $expr: { $eq: ['?4', 'null'] } } , { 'createdAt' : { $gte: ?4, $lt: ?5 } } ] } " +
            "] }";

    @Query(queryStr)
    Page<AuditLogs> getAuditLogs(Long accountId, String updatedByUsername, String moduleName, String action, LocalDate fromDate, LocalDate toDate, Pageable pageable);

    @Query(queryStr)
    List<AuditLogs> getAuditLogsWithoutPagination(Long accountId, String updatedByUsername, String moduleName, String action, LocalDate fromDate, LocalDate toDate);

}
