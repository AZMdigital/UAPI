package com.azm.apihub.backend.companies.configurations.repositoriy;

import com.azm.apihub.backend.entities.Configuration;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConfigurationRepository extends JpaRepository<Configuration, Long> {
    Optional<Configuration> findConfigurationsByHandle(String name);
}
