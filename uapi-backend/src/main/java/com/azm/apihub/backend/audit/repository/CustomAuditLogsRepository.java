package com.azm.apihub.backend.audit.repository;

import java.util.List;

public interface CustomAuditLogsRepository {
    List<String> findDistinctUpdatedByUsernames();
}
