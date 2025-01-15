package com.azm.apihub.backend.customHeader.repository;

import com.azm.apihub.backend.entities.CompanyCustomHeader;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;

@Repository
public interface CompanyCustomHeaderRepository extends JpaRepository<CompanyCustomHeader, Long> {

    @Query(value = "select c.* from apihub.company_custom_header c where company_id = :companyId", nativeQuery = true)
    List<CompanyCustomHeader> findAllByCompanyId(Long companyId);

    @Transactional
    @Modifying
    @Query(value = "delete from apihub.company_custom_header where company_id = :companyId", nativeQuery = true)
    void deleteAllByCompanyId(Long companyId);
}
