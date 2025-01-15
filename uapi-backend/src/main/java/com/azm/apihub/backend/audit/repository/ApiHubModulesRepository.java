package com.azm.apihub.backend.audit.repository;

import com.azm.apihub.backend.entities.ApiHubModules;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApiHubModulesRepository extends JpaRepository<ApiHubModules, Long> {

    Optional<ApiHubModules> findByModuleHandle(String moduleHandle);
}
