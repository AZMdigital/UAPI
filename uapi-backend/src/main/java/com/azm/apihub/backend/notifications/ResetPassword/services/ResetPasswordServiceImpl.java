package com.azm.apihub.backend.notifications.ResetPassword.services;

import com.azm.apihub.backend.entities.ResetPasswordRequest;
import com.azm.apihub.backend.entities.User;
import com.azm.apihub.backend.exceptions.BadRequestException;
import com.azm.apihub.backend.notifications.ResetPassword.models.ResetPassword;
import com.azm.apihub.backend.notifications.UrlUtil;
import com.azm.apihub.backend.notifications.emailTemplateBuilder.EmailTemplateBuilder;
import com.azm.apihub.backend.notifications.ResetPassword.repositories.ResetPasswordRequestRepository;
import com.azm.apihub.backend.keycloak.services.KeycloakService;
import com.azm.apihub.backend.users.repository.UserRepository;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.*;
import lombok.extern.slf4j.Slf4j;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;


@Slf4j
@Service
public class ResetPasswordServiceImpl implements ResetPasswordService {
    private final UserRepository userRepository;
    private final ResetPasswordRequestRepository resetPasswordRequestRepository;
    private final KeycloakService keycloakService;
    private final EmailTemplateBuilder emailTemplateBuilder;

    @Autowired
    public ResetPasswordServiceImpl(UserRepository userRepository,
                                    ResetPasswordRequestRepository resetPasswordRequestRepository,
                                    EmailTemplateBuilder emailTemplateBuilder,
                                    KeycloakService keycloakService) {
        this.userRepository = userRepository;
        this.resetPasswordRequestRepository = resetPasswordRequestRepository;
        this.emailTemplateBuilder = emailTemplateBuilder;
        this.keycloakService = keycloakService;
    }

    @Override
    public void sendResetPasswordEmail(UUID requestId, String email, HttpServletRequest httpServletRequest) {
        Optional<User> optionalUser = userRepository.findByEmailAndIsDeletedFalse(email);

        if(optionalUser.isPresent()) {
            User user = optionalUser.get();

            List<UserRepresentation> userRepresentationList = keycloakService.getUser(user.getUsername());
            if (userRepresentationList != null && !userRepresentationList.isEmpty()) {

                var userRepresentation = userRepresentationList.get(0);
                log.info("Got user email from keycloak: " + userRepresentation.getEmail());

                String token = UUID.randomUUID().toString();

                Optional<ResetPasswordRequest> request = resetPasswordRequestRepository.findByUser(user);

                request.ifPresent(resetPasswordRequest -> resetPasswordRequestRepository.deleteById(resetPasswordRequest.getId()));

                resetPasswordRequestRepository.save(convertToEntity(user, token));

                emailTemplateBuilder.sendResetPasswordEmail(UrlUtil.getBaseUrl(httpServletRequest), token,
                        user, "forgot_password_template.html");
            }
        }
    }

    @Override
    public void validateToken(String email, String token) {
        Optional<User> optionalUser = userRepository.findByEmailAndIsDeletedFalse(email);
        if(optionalUser.isEmpty())
            throw new BadRequestException("User does not exist");

        Optional<ResetPasswordRequest> resetPasswordRequest = resetPasswordRequestRepository.findByTokenAndUser(token, optionalUser.get());

        validate(resetPasswordRequest);
    }

    @Override
    public void resetPassword(UUID requestId, ResetPassword resetPassword, HttpServletRequest httpServletRequest) {
        Optional<User> optionalUser = userRepository.findByEmailAndIsDeletedFalse(resetPassword.getEmail());

        if(optionalUser.isEmpty())
            throw new BadRequestException("User does not exist");

        User user = optionalUser.get();

        Optional<ResetPasswordRequest> resetPasswordRequest =
                resetPasswordRequestRepository.findByTokenAndUser(resetPassword.getToken(), user);

        if(validate(resetPasswordRequest)) {
            //Reset password on keycloak
            keycloakService.resetPassword(user.getUsername(), resetPassword.getPassword());

            resetPasswordRequestRepository.deleteById(resetPasswordRequest.orElseThrow(() -> new BadRequestException("Invalid token")).getId());

            emailTemplateBuilder.sendUpdatePasswordEmail(user,
                    resetPassword.getPassword(), "edit_credentials_template.html");
        }
    }

    private ResetPasswordRequest convertToEntity(User user, String token) {
        ResetPasswordRequest resetPasswordRequest = new ResetPasswordRequest();
        resetPasswordRequest.setToken(token);
        resetPasswordRequest.setUser(user);

        // Set expiry time to 3 days from now
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.HOUR, 72);
        resetPasswordRequest.setCreatedAt(Timestamp.from(Instant.now()));
        resetPasswordRequest.setExpiryAt(new Timestamp(calendar.getTimeInMillis()));

        return resetPasswordRequest;
    }

    private boolean validate(Optional<ResetPasswordRequest> resetPasswordRequest) {
        if(resetPasswordRequest.isEmpty())
            throw new BadRequestException("Invalid token");

        final Calendar cal = Calendar.getInstance();
        var isAfter = resetPasswordRequest.get().getExpiryAt().before(cal.getTime());

        if(isAfter)
            throw new BadRequestException("Token is expired");

        return true;
    }
}
