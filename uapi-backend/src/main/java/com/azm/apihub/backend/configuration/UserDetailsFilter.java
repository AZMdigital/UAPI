package com.azm.apihub.backend.configuration;

import com.azm.apihub.backend.constants.BackendConstants;
import com.azm.apihub.backend.entities.User;
import com.azm.apihub.backend.exceptions.BadRequestException;
import com.azm.apihub.backend.users.models.UserDetails;
import com.azm.apihub.backend.users.services.UserService;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
@Component
@Order(10)
public class UserDetailsFilter extends OncePerRequestFilter {

    protected final Log logger = LogFactory.getLog(getClass());
    private static final String USERNAME_HEADER = "preferred_username";
    private static final String EMAIL_HEADER = "email";
    private static final String FIRST_NAME = "given_name";
    private static final String LAST_NAME = "family_name";


    UserService userService;

    public UserDetailsFilter(UserService userService) {
        this.userService = userService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(authentication != null && authentication.isAuthenticated()) {
            List<String> authorities = authentication.getAuthorities().stream().map(auth -> auth.getAuthority()).collect(Collectors.toList());
            if(authentication.getPrincipal() instanceof Jwt) {
                Jwt jwt = (Jwt) authentication.getPrincipal();
                String username = (String) jwt.getClaims().get(USERNAME_HEADER);
                String email = (String) jwt.getClaims().get(EMAIL_HEADER);
                String firstName = (String) jwt.getClaims().get(FIRST_NAME);
                String familyName = (String) jwt.getClaims().get(LAST_NAME);

                UserDetails userDetails = null;
                if(authorities.contains("ROLE_" + BackendConstants.USER_ROLE)) {
                    try {
                        userDetails = new UserDetails(userService.getUserByUsername(username));
                    } catch (BadRequestException ex) {
                        logger.info("User does not exist in AZM hub, " + username);
                        response.sendError(HttpStatus.UNAUTHORIZED.value(), ex.getMessage());
                        return;
                    }
                } else if (authorities.contains("ROLE_" + BackendConstants.ADMIN_ROLE)) {
                    // Admin does not have user in the system so setting that to null
                    User user = new User();
                    user.setUsername(username);
                    user.setEmail(email);
                    user.setLastName(familyName);
                    user.setFirstName(firstName);
                    userDetails = new UserDetails(user);
                }

                Authentication updatedAuthentication = new UsernamePasswordAuthenticationToken(
                        userDetails, authentication.getCredentials(),
                        authentication.getAuthorities());

                SecurityContextHolder.getContext().setAuthentication(updatedAuthentication);
            }
        }

        filterChain.doFilter(request, response);
    }
}
