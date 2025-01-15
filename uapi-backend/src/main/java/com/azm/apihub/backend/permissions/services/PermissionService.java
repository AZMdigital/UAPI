package com.azm.apihub.backend.permissions.services;

import com.azm.apihub.backend.entities.Permission;
import com.azm.apihub.backend.permissions.repository.PermissionRepository;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import static com.azm.apihub.backend.constants.BackendConstants.SUB_ACCOUNT_MANAGEMENT_HANDLE;

@Slf4j
@Service
public class PermissionService {
    private final PermissionRepository permissionRepository;

    @Autowired
    public PermissionService(PermissionRepository permissionRepository) {
        this.permissionRepository = permissionRepository;
    }

    public List<Permission> getAllPermissions(boolean isSubAccount) {
        if(isSubAccount)
            return this.permissionRepository.findAllByGroupHandleNot(SUB_ACCOUNT_MANAGEMENT_HANDLE);
        return this.permissionRepository.findAll();
    }
}
