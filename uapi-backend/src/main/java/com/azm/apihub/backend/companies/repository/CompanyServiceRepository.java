package com.azm.apihub.backend.companies.repository;

import com.azm.apihub.backend.entities.CompanyService;
import java.util.List;
import javax.transaction.Transactional;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CompanyServiceRepository extends JpaRepository<CompanyService, Long> {
    List<CompanyService> findAllByCompanyId(Long companyId);

    Optional<CompanyService> findByCompanyIdAndServiceId(Long companyId, Long serviceId);

    @Transactional
    @Modifying
    @Query("DELETE FROM CompanyService cs WHERE cs.company.id = :companyId")
    void deleteAllServicesByCompanyId(@Param("companyId") Long companyId);
}