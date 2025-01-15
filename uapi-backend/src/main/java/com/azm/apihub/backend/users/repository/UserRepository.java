package com.azm.apihub.backend.users.repository;

import com.azm.apihub.backend.entities.Company;
import com.azm.apihub.backend.entities.User;
import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface UserRepository extends JpaRepository<User, Long> {
    Page<User> findAllByIsDeletedFalseOrderByIdDesc(Pageable pageable);

    List<User> findAllByIsDeletedFalseOrderByIdDesc();

    List<User> findAllByCompanyIsNotNullAndCompanyIsAndIsDeletedFalse(Company company);

    Optional<User> findByIdAndIsDeletedFalse(Long userId);

    @Query("SELECT u FROM User u WHERE u.company.id = :companyId AND u.id = :userId AND u.isDeleted = false AND u.isActive = true")
    Optional<User> getUserByCompany(@Param("companyId") Long companyId, @Param("userId") Long userId);

    @Query("SELECT u FROM User u INNER JOIN Company c ON c.id = u.company.id WHERE u.isDeleted = false AND u.isActive = true AND LOWER(u.username) = :username AND c.isActive = true")
    Optional<User> findByUsername(@Param("username") String username);

    @Query("SELECT u FROM User u where u.role.id = :roleId AND u.isDeleted = false")
    List<User> findAllByRoleId(@Param("roleId") Long roleId);

    @Transactional
    @Modifying
    @Query("UPDATE User u SET u.role.id = NULL WHERE u.isDeleted = true AND u.role.id = :roleId ")
    void deleteRoleIdFromDeletedUsers(@Param("roleId") Long roleId);

    Optional<User> findByEmailAndIsDeletedFalse(String email);

    @Transactional
    @Modifying
    @Query("UPDATE User user SET user.isDeleted = true, user.deletedAt = :deletedAt, user.username = :username, user.email = :email WHERE user.id = :id AND user.isDeleted = false")
    void softDeleteById(@Param("id") Long id, @Param("deletedAt") Timestamp deletedAt,
                        @Param("username") String username, @Param("email") String email);
    @Query("SELECT u FROM User u INNER JOIN Company c on u.company.id = c.id WHERE u.isDeleted = false AND c.isDeleted=false AND " +
            "(:query IS NULL OR LOWER(u.firstName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            ":query IS NULL OR LOWER(u.lastName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            ":query IS NULL OR LOWER(u.email) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
            "(:company IS NULL OR LOWER(c.companyName) LIKE LOWER(CONCAT('%', :company, '%')))")
    Page<User> getSearchedUsers(@Param("query") String query, Pageable pageable, @Param("company") String companyName);

    @Query("SELECT u FROM User u WHERE u.company.id = :accountId AND u.isDeleted = false")
    Page<User> getAllUsersForAccount(@Param("accountId") Long accountId, Pageable pageable);

    @Query("SELECT DISTINCT c.companyName From User u INNER JOIN Company c on u.company.id = c.id WHERE u.isDeleted=false AND c.isDeleted=false")
    List <String> findAllCompanyNamesForUsers();

    @Query("SELECT u FROM User u WHERE u.company.id = :accountId AND u.isDeleted = false AND (LOWER(u.firstName) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(u.lastName) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(u.email) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<User> getSearchedUsersByAccount(@Param("query") String query, @Param("accountId") Long accountId, Pageable pageable);

    @Query("SELECT u FROM User u WHERE u.isDeleted = false AND u.company.id = :companyID AND u.isActive = false")
    List<User> getReactivationUser(@Param("companyID") Long companyID);

    @Query("SELECT u FROM User u WHERE u.isDeleted = false AND u.company.id = :companyID AND u.isActive = true")
    List<User> getAllActiveUsersByCompanyId(@Param("companyID") Long companyID);

    @Query("SELECT u FROM User u WHERE u.isDeleted = false AND u.company.id = :companyID AND u.isActive = true AND u.isSuperAdmin = true")
    Optional<User> getSuperAdminUsersByCompanyId(@Param("companyID") Long companyID);

    @Query("SELECT u FROM User u WHERE u.isDeleted = false AND LOWER(u.username) = LOWER(:query) OR LOWER(u.email) = LOWER(:query)")
    Optional<User> findByUsernameOrEmailAndIsDeletedFalse(@Param("query") String query);

    @Query("SELECT u FROM User u WHERE u.company.id = :companyId AND u.isDeleted = false ORDER BY u.userCode DESC")
    List<User> findAllByCompanyIdOrderByUserCodeDesc(Long companyId);
}