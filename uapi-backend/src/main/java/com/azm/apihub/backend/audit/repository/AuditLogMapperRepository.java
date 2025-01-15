package com.azm.apihub.backend.audit.repository;

import com.azm.apihub.backend.audit.entities.AuditLogMapper;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuditLogMapperRepository extends JpaRepository<AuditLogMapper, Long> {
}
