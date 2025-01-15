package com.azm.apihub.backend.lookups.repository;

import com.azm.apihub.backend.entities.LookupType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LookupTypeRepository extends JpaRepository<LookupType, Long> {

}