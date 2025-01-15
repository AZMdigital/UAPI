package com.azm.apihub.backend.configuration.rolesAndPermissions;

import com.azm.apihub.backend.constants.BackendConstants;
import com.azm.apihub.backend.entities.Permission;
import com.azm.apihub.backend.exceptions.ForbiddenException;
import com.azm.apihub.backend.exceptions.UnAuthorizedException;
import com.azm.apihub.backend.roles.repository.RolePermissionRepository;
import com.azm.apihub.backend.users.models.UserDetails;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Aspect
@Component
public class SecurityAspect {

    private final RolePermissionRepository rolePermissionRepository;

    @Autowired
    public SecurityAspect(RolePermissionRepository rolePermissionRepository) {
        this.rolePermissionRepository = rolePermissionRepository;
    }

    @Autowired(required = false)
    private String[] publicPaths;

    @Before("@annotation(org.springframework.web.bind.annotation.PostMapping) || " +
            "@annotation(org.springframework.web.bind.annotation.PutMapping) || " +
            "@annotation(org.springframework.web.bind.annotation.PatchMapping) || " +
            "@annotation(org.springframework.web.bind.annotation.DeleteMapping)")
    public void beforePostPutPatchDeleteHttpMethod(JoinPoint joinPoint) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String requestPath = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest().getRequestURI();
//        boolean isPublicPath = publicPaths == null || Arrays.asList(publicPaths).contains(requestPath);

        boolean isPublicPath = publicPaths == null || Arrays.stream(publicPaths)
                .anyMatch(path -> requestPath.equals(path) || requestPath.startsWith(path + "/"));

        if(!isPublicPath) {
            MethodSignature signature = (MethodSignature) joinPoint.getSignature();
            Method method = signature.getMethod();
            RequiresPermission requiresPermission = method.getAnnotation(RequiresPermission.class);

            if (Objects.isNull(requiresPermission) || requiresPermission.value().length == 0) {
                if (authentication != null && authentication.isAuthenticated()) {
                    boolean hasAdminRole = authentication.getAuthorities().stream()
                            .anyMatch(authority -> authority.getAuthority().equals("ROLE_" + BackendConstants.ADMIN_ROLE));
                    if (!hasAdminRole) {
                        throw new UnAuthorizedException("Access Denied: Admin role required.");
                    }
                } else {
                    throw new UnAuthorizedException("Access Denied: Authentication required.");
                }
            }
        }
    }

    @Before("@annotation(RequiresPermission)")
    public void checkPermissions(JoinPoint joinPoint) {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();
        RequiresPermission requiresPermission = method.getAnnotation(RequiresPermission.class);
        String[] requiredPermissions = requiresPermission.value();

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("You must be authenticated to access this resource.");
        }

        Set<String> authorities = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toSet());

        //Calling APIs from integrations service
        if(authorities.contains("ROLE_ADMIN_ROLE")) {
            return;
        }

        UserDetails userDetails = ((UserDetails) authentication.getPrincipal());

        if(userDetails != null && !userDetails.isAdmin() && !userDetails.isAccountSuperAdmin()) {
            if (!userDetails.getRole().getIsActive())
                throw new ForbiddenException("Your assigned role is inactive.");

            Set<String> userPermissions = rolePermissionRepository.findAllByRoleIdAndCompanyId(
                    userDetails.getRole().getId(), userDetails.getCompany().getId())
                    .stream()
                    .map(Permission::getHandle)
                    .collect(Collectors.toSet());

            boolean hasPermission = Arrays.stream(requiredPermissions)
                    .allMatch(userPermissions::contains);

            if (!hasPermission)
                throw new ForbiddenException("You do not have the required permissions to access this resource.");
        }
    }
}
