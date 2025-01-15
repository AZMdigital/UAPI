package com.azm.apihub.backend.callback.repositories;

import com.azm.apihub.backend.entities.ServiceCallback;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ServiceCallbackRepository extends JpaRepository<ServiceCallback, Long> {
   Optional<ServiceCallback> findAllByTransactionIdAndIsCompletedFalse(String transactionId);
}