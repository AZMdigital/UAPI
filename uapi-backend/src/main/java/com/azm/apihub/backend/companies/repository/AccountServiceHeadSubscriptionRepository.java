package com.azm.apihub.backend.companies.repository;

import com.azm.apihub.backend.entities.AccountServiceHeadSubscription;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AccountServiceHeadSubscriptionRepository extends JpaRepository<AccountServiceHeadSubscription, Long> {

    @Query("SELECT s.serviceHead.id FROM AccountServiceHeadSubscription s WHERE s.company.id = :companyId")
    List<Long> findAllSubscribedServiceHeadIdsByCompanyId(@Param("companyId") Long companyId);

    List<AccountServiceHeadSubscription> findAllByCompanyIdAndServiceHeadId(@Param("companyId") Long companyId, @Param("serviceHeadId") Long serviceHeadId);
}
