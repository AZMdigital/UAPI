package com.azm.apihub.backend.notifications.ResetPassword.repositories;

import com.azm.apihub.backend.entities.ResetPasswordRequest;
import com.azm.apihub.backend.entities.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResetPasswordRequestRepository extends JpaRepository<ResetPasswordRequest, Long> {
    Optional<ResetPasswordRequest> findByUser(User user);
    Optional<ResetPasswordRequest> findByTokenAndUser(String token, User user);
}