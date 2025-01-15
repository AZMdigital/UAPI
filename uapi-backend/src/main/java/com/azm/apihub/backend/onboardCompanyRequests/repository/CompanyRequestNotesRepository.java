package com.azm.apihub.backend.onboardCompanyRequests.repository;

import com.azm.apihub.backend.entities.OnboardCompanyRequestNotes;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompanyRequestNotesRepository extends JpaRepository<OnboardCompanyRequestNotes, Long> {

    List<OnboardCompanyRequestNotes> findByOnboardCompanyRequestId(Long onboardCompanyRequestId);

    void deleteByOnboardCompanyRequestId(Long onboardCompanyRequestId);
}