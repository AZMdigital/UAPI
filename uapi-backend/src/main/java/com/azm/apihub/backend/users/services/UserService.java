package com.azm.apihub.backend.users.services;

import com.azm.apihub.backend.entities.User;
import com.azm.apihub.backend.users.models.*;
import java.util.List;
import java.util.UUID;

public interface UserService {
    UserResponse getAllUsers(UUID requestId, String query, int pageNumber, int pageSize, String companyName);

    List <String> getAllCompanyNamesForUsers();

    UserResponse getAllUsersForAccount(UUID requestId, long companyId, String query, int pageNumber, int pageSize);

    User getUserById(UUID requestId, Long userId);
    User getUserByIdAndAccountId(UUID requestId, Long companyId, Long userId);

    User getUserByUsername(String username);

    User createUser(UUID requestId, UserRequest userRequest);

    User createUser(UUID requestId, UserRequest userRequest, boolean isSuperAdmin);

    User updateUser(UUID requestId, Long id, UpdateUserRequest updateUserRequest, boolean isSuperAdmin);

    void deleteUser(Long id, boolean isRequestFromPortal);

    void deleteUser(Long companyId, Long id, boolean isRequestFromPortal);

    UserTokenResponse getUserTokenById(UUID requestId, String username, String password);

    UserTokenResponse getAdminTokenById(UUID requestId, String username, String password);

    UserTokenResponse getUserTokenByRefreshToken(UUID requestId, String refreshToken);

    void logoutUserByRefreshToken(UUID requestId, String refreshToken);

    UserExist checkUserIsExist(UUID requestId, String query);

    UserTokenResponse switchToSubAccount(UUID requestID, Long subAccountId, UserDetails userDetails);
}
