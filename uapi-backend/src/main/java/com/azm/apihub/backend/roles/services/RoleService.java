package com.azm.apihub.backend.roles.services;

import com.azm.apihub.backend.entities.Company;
import com.azm.apihub.backend.entities.Permission;
import com.azm.apihub.backend.entities.Role;
import com.azm.apihub.backend.entities.RolePermission;
import com.azm.apihub.backend.entities.User;
import com.azm.apihub.backend.exceptions.BadRequestException;
import com.azm.apihub.backend.notifications.emailTemplateBuilder.EmailTemplateBuilder;
import com.azm.apihub.backend.permissions.repository.PermissionRepository;
import com.azm.apihub.backend.roles.models.RoleRequest;
import com.azm.apihub.backend.roles.models.UpdateRoleRequest;
import com.azm.apihub.backend.roles.repository.RolePermissionRepository;
import com.azm.apihub.backend.roles.repository.RoleRepository;
import com.azm.apihub.backend.users.models.UserDetails;
import com.azm.apihub.backend.users.repository.UserRepository;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import javax.validation.constraints.Email;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

@Slf4j
@Service
public class RoleService {
    private final RoleRepository roleRepository;

    private final RolePermissionRepository rolePermissionRepository;
    private final PermissionRepository permissionRepository;
    private EmailTemplateBuilder emailTemplateBuilder;

    private final UserRepository userRepository;

    @Autowired
    public RoleService(RoleRepository roleRepository,
                       PermissionRepository permissionRepository,
                       UserRepository userRepository,
                       RolePermissionRepository rolePermissionRepository,
                       EmailTemplateBuilder emailTemplateBuilder) {
        this.roleRepository = roleRepository;
        this.permissionRepository = permissionRepository;
        this.userRepository = userRepository;
        this.rolePermissionRepository = rolePermissionRepository;
        this.emailTemplateBuilder = emailTemplateBuilder;
    }

    public List<Role> getAllRoles(Long companyId, String roleName) {
        List <Role> roleList;
        if (roleName != null && !roleName.isEmpty()) {
            roleList = roleRepository.findAllByCompanyIdAndRoleName(companyId, roleName);
        }
        else
        {
            roleList= roleRepository.findAllByCompanyId(companyId);
        }
        return roleList;
    }

    public List<Permission> getAllRolePermissions(Long roleId, Long companyId) {
        return rolePermissionRepository.findAllByRoleIdAndCompanyId(roleId, companyId);
    }

    @Transactional
    public void deleteRole(Long roleId, Long companyId) {

        Optional<Role> optionalRole = roleRepository.findByRoleIdAndCompanyId(roleId, companyId);

        if(optionalRole.isEmpty()) {
            throw new BadRequestException("Role does not exists");
        }

        List<User> users = userRepository.findAllByRoleId(roleId);
        if(!CollectionUtils.isEmpty(users)) {
            throw new BadRequestException("Please un assign this role from the users before trying to delete this role");
        }

        Role role = optionalRole.get();
        rolePermissionRepository.deleteByRoleId(roleId);
        userRepository.deleteRoleIdFromDeletedUsers(roleId);
        roleRepository.delete(role);
    }


    @Transactional
    public Role createRole(RoleRequest roleRequest, Company company, String username) {

        List<Permission> permissions = permissionRepository.findAllByHandles(roleRequest.getPermissions());

        if(CollectionUtils.isEmpty(permissions)) {
            throw new BadRequestException("Please provide valid permissions for the role");
        }

        List<Role> existingRole = this.roleRepository.findAllByCompanyIdAndName(company.getId(), roleRequest.getName());

        if(!CollectionUtils.isEmpty(existingRole)) {
            throw new BadRequestException("Role already exists with this name");
        }

        Role role = new Role();
        role.setCompany(company);
        role.setName(roleRequest.getName());
        role.setIsActive(roleRequest.getActive());
        role.setCreatedBy(username);
        role.setUpdatedBy(username);
        final Timestamp now = Timestamp.from(Instant.now());
        role.setCreatedAt(now);
        role.setUpdatedAt(now);
        List<Role> roles = roleRepository.findAllByCompanyIdOrderByRoleCodeDesc(company.getId());
        Optional<Role> roleOptional = roles.stream().findFirst();
        if (roleOptional.isPresent()) {
            long roleCode = Long.parseLong(roleOptional.get().getRoleCode().substring(1));
            role.setRoleCode(String.format("R%03d", roleCode + 1));
        } else {
            role.setRoleCode(String.format("R%03d", 1));
        }
        role = roleRepository.save(role);

        Role finalRole = role;
        List<RolePermission> rolePermissions = permissions.stream().map(permission -> {
            RolePermission rolePermission = new RolePermission();
            rolePermission.setRole(finalRole);
            rolePermission.setPermission(permission);
            rolePermission.setCreatedAt(now);
            rolePermission.setUpdatedAt(now);
            rolePermission.setCreatedBy(username);
            rolePermission.setUpdatedBy(username);
            return rolePermission;
        }).collect(Collectors.toList());

        this.rolePermissionRepository.saveAll(rolePermissions);
        return role;
    }

    @Transactional
    public Role updateRole(Long id, UpdateRoleRequest updateRoleRequest, Company company, UserDetails user) {
        Optional<Role> optionalRole = this.roleRepository.findByRoleIdAndCompanyId(id, company.getId());
        if(optionalRole.isEmpty()) {
            throw new BadRequestException("Roles does not exist.");
        }

        Role role = optionalRole.get();
        User updatedUser = new User();
        updatedUser.setEmail(user.getEmail());
        updatedUser.setFirstName(user.getFirstName());
        updatedUser.setLastName(user.getLastName());
        updatedUser.setUsername(user.getUsername());
        String username = user.getUsername();

        List<Permission> permissions = permissionRepository.findAllByHandles(updateRoleRequest.getPermissions());

        if(CollectionUtils.isEmpty(permissions)) {
            throw new BadRequestException("Please provide valid permissions for the role");
        }

        List<User> users = userRepository.findAllByRoleId(role.getId());

        role.setName(updateRoleRequest.getName());

        if(users == null || users.isEmpty())
            role.setIsActive(updateRoleRequest.getActive());

        role.setUpdatedBy(username);
        final Timestamp now = Timestamp.from(Instant.now());
        role.setUpdatedAt(now);

        role = roleRepository.save(role);

        this.rolePermissionRepository.deleteByRoleId(role.getId());

        Role finalRole = role;
        List<RolePermission> rolePermissions = permissions.stream().map(permission -> {
            RolePermission rolePermission = new RolePermission();
            rolePermission.setRole(finalRole);
            rolePermission.setPermission(permission);
            rolePermission.setCreatedAt(now);
            rolePermission.setUpdatedAt(now);
            rolePermission.setCreatedBy(username);
            rolePermission.setUpdatedBy(username);
            return rolePermission;
        }).collect(Collectors.toList());
        this.rolePermissionRepository.saveAll(rolePermissions);
        try {
            this.rolePermissionRepository.saveAll(rolePermissions);
            emailTemplateBuilder.sendUpdateUserProfileEmail(updatedUser, "edit_role_template.html");
        } catch (Exception e) {
            log.warn("Unable to send email to user: " + updatedUser.getUsername());
        }
        return role;
    }

    public List<Role> getAllRolesByCompanyId(Long companyId) {
        return roleRepository.findActiveRolesByCompanyId(companyId);
    }
}