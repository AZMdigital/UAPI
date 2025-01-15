package com.azm.apihub.backend.requestLogs.repository;

import com.azm.apihub.backend.entities.RequestLogs;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RequestLogsRepository extends JpaRepository<RequestLogs, Long> {
    Optional<RequestLogs> findByRequestUuid(String requestUuid);
}