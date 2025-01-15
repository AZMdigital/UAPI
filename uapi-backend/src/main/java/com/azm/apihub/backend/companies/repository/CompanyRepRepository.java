package com.azm.apihub.backend.companies.repository;

import com.azm.apihub.backend.entities.CompanyRep;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompanyRepRepository extends JpaRepository<CompanyRep, Long> {
}