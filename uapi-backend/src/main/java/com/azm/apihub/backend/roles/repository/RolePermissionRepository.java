package com.azm.apihub.backend.roles.repository;

import com.azm.apihub.backend.entities.Permission;
import com.azm.apihub.backend.entities.RolePermission;
import java.util.List;
import javax.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface RolePermissionRepository extends JpaRepository<RolePermission, Long> {

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM RolePermission rp where rp.role.id = :roleId")
    void deleteByRoleId(Long roleId);

    @Query("SELECT r.permission FROM RolePermission r where r.role.id = :roleId and r.role.company.id = :companyId")
    List<Permission> findAllByRoleIdAndCompanyId(Long roleId, Long companyId);
}