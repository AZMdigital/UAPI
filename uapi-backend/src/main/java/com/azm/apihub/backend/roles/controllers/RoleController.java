package com.azm.apihub.backend.roles.controllers;

import com.azm.apihub.backend.ApiHubUtils;
import com.azm.apihub.backend.configuration.rolesAndPermissions.RequiresPermission;
import com.azm.apihub.backend.entities.Permission;
import com.azm.apihub.backend.entities.Role;
import com.azm.apihub.backend.exceptions.BadRequestException;
import com.azm.apihub.backend.roles.models.RoleRequest;
import com.azm.apihub.backend.roles.models.UpdateRoleRequest;
import com.azm.apihub.backend.roles.services.RoleService;
import com.azm.apihub.backend.roles.validator.RoleRequestValidator;
import com.azm.apihub.backend.users.services.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/roles")
@Tag(name = "Roles Management")
@AllArgsConstructor
@Slf4j
public class RoleController {

    @Autowired
    private RoleService roleService;

    @Autowired
    private RoleRequestValidator roleRequestValidator;

    @GetMapping
    @Operation(
            summary = "This Api is used to get all roles"
    )
    public ResponseEntity<List<Role>> getAllRoles(Authentication authentication,
                                                  @RequestParam(required = false) String roleName) {

        var startMillis = System.currentTimeMillis();

        com.azm.apihub.backend.users.models.UserDetails user = ((com.azm.apihub.backend.users.models.UserDetails) authentication.getPrincipal());

        if (user.isAdmin()) {
            throw new BadRequestException("This request only works for portal users");
        }
        log.info("Request received for getting all roles");

        var result = roleService.getAllRoles(user.getCompany().getId(), roleName);

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Getting all roles took {} ms", timeTook);

        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @DeleteMapping(value = "/{id}")
    @Operation(
            summary = "This Api is used to delete a role",
            parameters = {
                    @Parameter(name = "id", description = "The id of role to delete"),
            }
    )
    @RequiresPermission({"role-delete"})
    public ResponseEntity<Void> deleteRole(@PathVariable Long id, Authentication authentication) {

        var startMillis = System.currentTimeMillis();

        log.info("Request received for deleting role ");

        com.azm.apihub.backend.users.models.UserDetails user = ((com.azm.apihub.backend.users.models.UserDetails) authentication.getPrincipal());

        if (user.isAdmin()) {
            throw new BadRequestException("This request only works for portal users");
        }

        roleService.deleteRole(id, user.getCompany().getId());

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Delete role service took {} ms", timeTook);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping
    @Operation(
            summary = "This Api is used to create a Role",
            parameters = {
                    @Parameter(name = "createRoleRequest", description = "The json body of role request"),
            }
    )
    @RequiresPermission({"role-add"})
    public ResponseEntity<Role> createRole(@RequestBody @Validated RoleRequest roleRequest,
                                           BindingResult bindingResult, Authentication authentication) {

        var startMillis = System.currentTimeMillis();
        log.info("Request received for creating role");

        com.azm.apihub.backend.users.models.UserDetails user = ((com.azm.apihub.backend.users.models.UserDetails) authentication.getPrincipal());

        if (user.isAdmin()) {
            throw new BadRequestException("This request only works for portal users");
        }

        roleRequestValidator.validate(roleRequest, bindingResult);
        ApiHubUtils.checkRequestErrors(bindingResult);

        var result = roleService.createRole(roleRequest, user.getCompany(), user.getUsername());

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Create role service took {} ms", timeTook);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    @PutMapping(value = "/{id}")
    @Operation(
            summary = "This Api is used to update a role",
            parameters = {
                    @Parameter(name = "updateRoleRequest", description = "Request for role update"),
            }
    )
    @RequiresPermission({"role-edit"})
    public ResponseEntity<Role> updateRole(@PathVariable Long id, @RequestBody @Validated UpdateRoleRequest updateRoleRequest, BindingResult bindingResult, Authentication authentication) {

        var startMillis = System.currentTimeMillis();

        log.info("Request received for updating role");

        com.azm.apihub.backend.users.models.UserDetails user = ((com.azm.apihub.backend.users.models.UserDetails) authentication.getPrincipal());

        if (user.isAdmin()) {
            throw new BadRequestException("This request only works for portal users");
        }

        roleRequestValidator.validate(updateRoleRequest, bindingResult);
        ApiHubUtils.checkRequestErrors(bindingResult);

        var result = roleService.updateRole(id, updateRoleRequest, user.getCompany(), user);

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Update role service took {} ms", timeTook);

        return new ResponseEntity<>(result, HttpStatus.OK);

    }

    @GetMapping(value = "/{id}/permissions")
    @Operation(
            summary = "This Api is used to get all permissions of a role"
    )
    public ResponseEntity<List<Permission>> getRolePermissions(@PathVariable Long id, Authentication authentication) {

        var startMillis = System.currentTimeMillis();

        com.azm.apihub.backend.users.models.UserDetails user = ((com.azm.apihub.backend.users.models.UserDetails) authentication.getPrincipal());

        if (user.isAdmin()) {
            throw new BadRequestException("This request only works for portal users");
        }
        log.info("Request received for getting all role permissions");

        var result = roleService.getAllRolePermissions(id, user.getCompany().getId());

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Getting all Permissions took {} ms", timeTook);

        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/company/{companyId}")
    @Operation(
            summary = "This Api is used to get all roles by company id"
    )
    public ResponseEntity<List<Role>> getAllRolesByCompanyId(@PathVariable Long companyId) {

        var startMillis = System.currentTimeMillis();
        log.info("Request received for getting all roles by company id");

        var result = roleService.getAllRolesByCompanyId(companyId);
        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Getting all roles by company id took {} ms", timeTook);

        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}