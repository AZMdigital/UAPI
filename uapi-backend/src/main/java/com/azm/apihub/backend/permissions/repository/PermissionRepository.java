package com.azm.apihub.backend.permissions.repository;

import com.azm.apihub.backend.entities.Permission;
import com.azm.apihub.backend.entities.Role;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PermissionRepository extends JpaRepository<Permission, Long> {

    @Query("SELECT p FROM Permission p WHERE p.handle IN :handles")
    List<Permission> findAllByHandles(List<String> handles);

    @Query("SELECT p FROM Permission p WHERE p.permissionGroup.handle != :groupHandle")
    List<Permission> findAllByGroupHandleNot(String groupHandle);
}