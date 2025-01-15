package com.azm.apihub.backend.roles.repository;

import com.azm.apihub.backend.entities.Role;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface RoleRepository extends JpaRepository<Role, Long> {

    @Query("SELECT r FROM Role r where r.company.id = :companyId")
    List<Role> findAllByCompanyId(Long companyId);

    @Query("SELECT r FROM Role r where r.id = :roleId and r.company.id = :companyId")
    Optional<Role> findByRoleIdAndCompanyId(Long roleId, Long companyId);

    @Query("SELECT r FROM Role r where r.company.id = :companyId and r.name = :name")
    List<Role> findAllByCompanyIdAndName(Long companyId, String name);

    @Query("SELECT r FROM Role r WHERE r.company.id = :companyId AND LOWER(r.name) LIKE LOWER(CONCAT('%', :roleName, '%'))")
    List<Role> findAllByCompanyIdAndRoleName(Long companyId, String roleName);

    @Query("SELECT r FROM Role r WHERE r.company.id = :companyId ORDER BY r.roleCode DESC")
    List<Role> findAllByCompanyIdOrderByRoleCodeDesc(Long companyId);

    @Query("SELECT r FROM Role r where r.company.id = :companyId AND r.isActive = true")
    List<Role> findActiveRolesByCompanyId(Long companyId);
}