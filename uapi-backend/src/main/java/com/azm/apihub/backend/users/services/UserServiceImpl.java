package com.azm.apihub.backend.users.services;

import com.azm.apihub.backend.companies.enums.AccountType;
import com.azm.apihub.backend.entities.Company;
import com.azm.apihub.backend.companies.repository.CompanyRepository;
import com.azm.apihub.backend.entities.ResetPasswordRequest;
import com.azm.apihub.backend.entities.Role;
import com.azm.apihub.backend.exceptions.BadRequestException;
import com.azm.apihub.backend.keycloak.services.KeycloakService;
import com.azm.apihub.backend.entities.User;
import com.azm.apihub.backend.notifications.ResetPassword.repositories.ResetPasswordRequestRepository;
import com.azm.apihub.backend.notifications.emailTemplateBuilder.EmailTemplateBuilder;
import com.azm.apihub.backend.roles.repository.RoleRepository;
import com.azm.apihub.backend.users.models.*;
import com.azm.apihub.backend.users.repository.UserRepository;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.*;

import lombok.extern.slf4j.Slf4j;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.ws.rs.NotAuthorizedException;

@Slf4j
@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final ResetPasswordRequestRepository resetPasswordReqUser;
    private final CompanyRepository companyRepository;
    private final KeycloakService keycloakService;
    private final EmailTemplateBuilder emailTemplateBuilder;

    private final RoleRepository roleRepository;

    private final String APPLICATION_TAG;

    private final String BAD_REQUEST_USER_DOES_NOT_EXIST = "User does not exist (it's either inactive or deleted or you are not admin of that account)";

    @Autowired
    public UserServiceImpl(UserRepository userRepository,
                           CompanyRepository companyRepository,
                           EmailTemplateBuilder emailTemplateBuilder,
                           KeycloakService keycloakService,
                           @Value("${apiHub.applicationTag}")  String application_tag,
                           ResetPasswordRequestRepository resetPasswordReqUser,
                           RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.companyRepository = companyRepository;
        this.emailTemplateBuilder = emailTemplateBuilder;
        this.keycloakService = keycloakService;
        this.APPLICATION_TAG = application_tag;
        this.resetPasswordReqUser = resetPasswordReqUser;
        this.roleRepository = roleRepository;
    }

    @Override
    public UserResponse getAllUsers(UUID requestId, String query, int pageNumber, int pageSize, String companyName) {
        Pageable pageable = PageRequest.of(pageNumber-1, pageSize);
        List<User> users;
        long count;
        if (  (query != null && !query.isEmpty()) || (companyName!=null && !companyName.isEmpty()) ) {
            users = userRepository.getSearchedUsers(query, pageable, companyName).getContent();
            count = userRepository.getSearchedUsers(query, pageable,companyName).getTotalElements();
        } else {
            users = userRepository.findAllByIsDeletedFalseOrderByIdDesc(pageable).getContent();
            count = userRepository.findAllByIsDeletedFalseOrderByIdDesc(pageable).getTotalElements();
        }
        return new UserResponse(true, "", count, users);
    }

    @Override
    public List <String> getAllCompanyNamesForUsers(){
        return userRepository.findAllCompanyNamesForUsers();

    }

    @Override
    public UserResponse getAllUsersForAccount(UUID requestId, long companyId, String query, int pageNumber, int pageSize) {
        Pageable pageable = PageRequest.of(pageNumber-1, pageSize);
        List<User> users;
        long count;
        if (query != null && !query.isEmpty()) {
            users = userRepository.getSearchedUsersByAccount(query, companyId, pageable).getContent();
            count = userRepository.getSearchedUsersByAccount(query, companyId, pageable).getTotalElements();
        } else {
            users = userRepository.getAllUsersForAccount(companyId, pageable).getContent();
            count = userRepository.getAllUsersForAccount(companyId, pageable).getTotalElements();
        }
        return new UserResponse(true, "", count, users);
    }

    @Override
    public User getUserById(UUID requestId, Long userId) {
        Optional<User> user = userRepository.findByIdAndIsDeletedFalse(userId);
        return user.orElseThrow(() -> new BadRequestException(BAD_REQUEST_USER_DOES_NOT_EXIST));
    }

    @Override
    public User getUserByIdAndAccountId(UUID requestId, Long companyId, Long userId) {
        Optional<User> user = userRepository.getUserByCompany(companyId, userId);
        return user.orElseThrow(() -> new BadRequestException(BAD_REQUEST_USER_DOES_NOT_EXIST));
    }

    @Override
    public User getUserByUsername(String username) {
        Optional<User> optionalUser = userRepository.findByUsername(username.toLowerCase());
        if(optionalUser.isEmpty())
            throw new BadRequestException(BAD_REQUEST_USER_DOES_NOT_EXIST);

        User user = optionalUser.get();
        if(!user.getIsSuperAdmin() && user.getRole() == null)
            throw new BadRequestException("There is no role assigned to this user");

        return user;
    }

    @Override
    public User createUser(UUID requestId, UserRequest userRequest) {
        return this.createUser(requestId, userRequest, false);
    }

    @Override
    public User createUser(UUID requestId, UserRequest userRequest, boolean isSuperAdmin) {

        Optional<User> optionalUser = userRepository.findByUsername(userRequest.getUsername().trim().toLowerCase());
        if(optionalUser.isPresent())
            throw new BadRequestException("User already present");

        Role role = null;
        if(!isSuperAdmin) {
            Optional<Role> optionalRole=
                    this.roleRepository.findByRoleIdAndCompanyId(userRequest.getRoleId(), userRequest.getCompanyId());

            if(optionalRole.isEmpty()) {
                throw new BadRequestException("Role does not exist");
            }

            role = optionalRole.get();
        }

        int status = keycloakService.createUser(requestId, userRequest);
        if(status == 201) {
            User user = convertToEntity(userRequest, isSuperAdmin);
            user.setRole(role);

            List<User> users = userRepository.findAllByCompanyIdOrderByUserCodeDesc(user.getCompany().getId());
            Optional<User> userOptional = users.stream().findFirst();
            if (userOptional.isPresent()) {
                long userCode = Long.parseLong(userOptional.get().getUserCode().substring(1));
                user.setUserCode(String.format("U%03d", userCode + 1));
            } else {
                user.setUserCode(String.format("U%03d", 1));
            }


            User savedUser = userRepository.save(user);
            log.info(APPLICATION_TAG+": User created successfully");
            String token = UUID.randomUUID().toString();
            Optional<ResetPasswordRequest> request = resetPasswordReqUser.findByUser(user);
            request.ifPresent(resetPasswordRequest -> resetPasswordReqUser.deleteById(resetPasswordRequest.getId()));
            resetPasswordReqUser.save(convertToEntityForSetPassword(user,token));
            emailTemplateBuilder.sendSetPasswordEmail(token, user, "set_user_password_template.html");
            return savedUser;
        } else if(status == 409) {
            throw new BadRequestException("User is already present");
        }

        throw new NotAuthorizedException("Does not have permission to perform this action");
    }

    @Override
    public User updateUser(UUID requestId, Long id, UpdateUserRequest updateUserRequest, boolean isSuperAdmin) {
        Optional<User> userResult = userRepository.findByIdAndIsDeletedFalse(id);

        if(userResult.isEmpty()) {
            throw new BadRequestException(BAD_REQUEST_USER_DOES_NOT_EXIST);
        }

        User user = userResult.get();

        Role role = null;
        if(!userResult.get().getIsSuperAdmin()) {
            Optional<Role> optionalRole=
                    this.roleRepository.findByRoleIdAndCompanyId(updateUserRequest.getRoleId(), updateUserRequest.getCompanyId());

            if(optionalRole.isEmpty()) {
                throw new BadRequestException("Role does not exist");
            }

            role = optionalRole.get();
        }


        //Update user on keycloak
        keycloakService.updateUser(user.getUsername(), updateUserRequest);

        user.setFirstName(updateUserRequest.getFirstName());
        user.setLastName(updateUserRequest.getLastName());
        user.setContactNo(updateUserRequest.getContactNo());
        user.setUserType(updateUserRequest.getUserType());
        user.setRole(role);
        user.setUpdatedAt(Timestamp.from(Instant.now()));
        user.setNationalId(updateUserRequest.getNationalId());

        if(!user.getIsSuperAdmin()) {
            if (updateUserRequest.getIsActive() != null)
                user.setIsActive(updateUserRequest.getIsActive());
            if (updateUserRequest.getCompanyId() != null) {
                Optional<Company> company = companyRepository.findByIdAndIsDeletedFalse(updateUserRequest.getCompanyId());
                user.setCompany(company.orElse(null));
            }
        }

        //Update local db user
        User updatedUser = userRepository.save(user);
        log.info(APPLICATION_TAG + ": User updated successfully by user ID= " + user.getId());

        emailTemplateBuilder.sendUpdateUserProfileEmail(updatedUser, "edit_user_template.html");

        if (updateUserRequest.getPassword() != null && !updateUserRequest.getPassword().isBlank()) {
            emailTemplateBuilder.sendUpdatePasswordEmail(user,
                    updateUserRequest.getPassword(), "edit_credentials_template.html");
        }

        return updatedUser;

    }

    @Override
    public void deleteUser(Long id, boolean isRequestFromPortal) {
        Optional<User> userResult = userRepository.findByIdAndIsDeletedFalse(id);
        removeUserFromKeycloakAndDB(userResult, id, isRequestFromPortal);
    }

    @Override
    public void deleteUser(Long companyId, Long id, boolean isRequestFromPortal) {
        Optional<User> userResult = userRepository.getUserByCompany(companyId, id);
        removeUserFromKeycloakAndDB(userResult, id, isRequestFromPortal);
    }

    private void removeUserFromKeycloakAndDB(Optional<User> userResult, Long id, boolean isRequestFromPortal) {
        if(userResult.isPresent()) {
            User user = userResult.get();

            if(user.getIsSuperAdmin() && isRequestFromPortal)
                throw new BadRequestException("This user is assigned as Super Admin to account ["+user.getCompany().getCompanyName()+"], it cannot be deleted");

            keycloakService.deleteUser(user.getUsername());

            String deletedUserName = String.join("", user.getUsername(), "(deleted_", user.getId().toString(), ")");
            String deletedUserEmail = String.join("", user.getEmail(), "(deleted_", user.getId().toString(), ")");

            //Soft delete user in db
            userRepository.softDeleteById(id, Timestamp.from(Instant.now()), deletedUserName, deletedUserEmail);
            log.info(APPLICATION_TAG+": User deleted successfully by user id="+user.getId());

        } else
            throw new BadRequestException(BAD_REQUEST_USER_DOES_NOT_EXIST);
    }

    @Override
    public UserTokenResponse getUserTokenById(UUID requestId, String username, String password) {
        return keycloakService.getUserToken(username, password);
    }

    @Override
    public UserTokenResponse getAdminTokenById(UUID requestId, String username, String password) {
        return keycloakService.getAdminToken(username, password);
    }

    @Override
    public UserTokenResponse getUserTokenByRefreshToken(UUID requestId, String refreshToken) {
        return keycloakService.getUserRefreshToken(refreshToken);
    }

    @Override
    public void logoutUserByRefreshToken(UUID requestId, String refreshToken) {
        keycloakService.logoutUser(refreshToken);
    }

    @Override
    public UserExist checkUserIsExist(UUID requestId, String query) {
        Optional<User> optionalUser = userRepository.findByUsernameOrEmailAndIsDeletedFalse(query);

        UserExist userExist = new UserExist();
        userExist.setExist(optionalUser.isPresent());

        if(optionalUser.isEmpty()) {
            UserRepresentation userRepresentation = keycloakService.checkUserExistOnKeyCloak(query.toLowerCase());
            userExist.setExist(userRepresentation != null);
        }

        return userExist;
    }

    @Override
    public UserTokenResponse switchToSubAccount(UUID requestID, Long subAccountId, UserDetails userDetails) {
        if (userDetails.isAdmin())
            throw new BadRequestException("Switch to sub-account not allowed for Admin Portal");

        Company company = userDetails.getCompany();

        Optional<Company> subAccount = companyRepository.findById(subAccountId);
        if(subAccount.isEmpty() || !subAccount.get().getAccountType().equals(AccountType.SUB.name()))
            throw new BadRequestException("Sub-Account not exists");

        Optional<User> subAccountAdmin = subAccount.get().getUsers().stream()
                .filter(u -> u.getIsSuperAdmin() && u.getIsActive() && !u.getIsDeleted()).findFirst();
        if (subAccountAdmin.isPresent()) {
            if (!subAccountAdmin.get().getCompany().getMainAccountId().equals(company.getId()))
                throw new BadRequestException("Only main account of this sub-account is allowed to switch account");
            return keycloakService.exchangeUserToken(subAccountAdmin.get().getUsername());
        } else {
            throw new BadRequestException("Unable to switch to Sub-Account");
        }
    }

    private User convertToEntity(UserRequest userRequest, boolean isSuperAdmin) {
        User user = new User();
        user.setFirstName(userRequest.getFirstName());
        user.setLastName(userRequest.getLastName());
        user.setUsername(userRequest.getUsername().toLowerCase().trim());
        user.setEmail(userRequest.getEmail().trim());
        user.setContactNo(userRequest.getContactNo());
        user.setUserType(userRequest.getUserType());
        user.setNationalId(userRequest.getNationalId());
        user.setIsSuperAdmin(isSuperAdmin);
        if(userRequest.getCompanyId() != null) {
            Optional<Company> company = companyRepository.findByIdAndIsDeletedFalse(userRequest.getCompanyId());
            user.setCompany(company.orElse(null));
        }
        user.setIsActive(userRequest.getIsActive());
        user.setIsDeleted(false);
        user.setCreatedAt(Timestamp.from(Instant.now()));
        user.setUpdatedAt(Timestamp.from(Instant.now()));

        return user;
    }

    private ResetPasswordRequest convertToEntityForSetPassword(User user, String token) {
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
}





