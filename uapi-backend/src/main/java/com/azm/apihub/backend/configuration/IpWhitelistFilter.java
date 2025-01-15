package com.azm.apihub.backend.configuration;

import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedAuthenticationToken;
import org.springframework.security.web.util.matcher.RequestMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@Slf4j
public class IpWhitelistFilter extends OncePerRequestFilter {

    private final Boolean enableWhitelistingIps;
    private final List<String> whitelistedIps;
    private final RequestMatcher requestMatcher;

    public IpWhitelistFilter(Boolean enableWhitelistingIps, List<String> whitelistedIps, RequestMatcher requestMatcher) {
        this.enableWhitelistingIps = enableWhitelistingIps;
        this.whitelistedIps = whitelistedIps;
        this.requestMatcher = requestMatcher;
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain)
            throws ServletException, IOException {
        String clientIp = request.getRemoteAddr();
        if(enableWhitelistingIps && requestMatcher.matches(request)) {
            if (whitelistedIps.contains(clientIp)) {
                // Bypass authentication for this request
                SecurityContextHolder.getContext().setAuthentication(
                        new PreAuthenticatedAuthenticationToken("whitelistedUser", null, null)
                );
            }
        }
        filterChain.doFilter(request, response);
    }
}
