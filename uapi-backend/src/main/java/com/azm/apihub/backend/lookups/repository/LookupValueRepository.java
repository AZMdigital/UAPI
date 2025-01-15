package com.azm.apihub.backend.lookups.repository;

import com.azm.apihub.backend.entities.LookupValue;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface LookupValueRepository extends JpaRepository<LookupValue, Long> {
    @Query("FROM LookupValue lv where lv.lookupType.id = :typeId")
    List<LookupValue> findAllByLookupTypeId(long typeId);
}