package com.azm.apihub.backend.configuration;

import java.io.IOException;
import org.springframework.stereotype.Component;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Component
public class SecurityHeadersFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) {}

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;

        // Add security headers
        response.setHeader("X-Content-Type-Options", "nosniff");
        response.setHeader("X-Frame-Options", "SAMEORIGIN");    // or DENY, or ALLOW-FROM
        response.setHeader("X-XSS-Protection", "1; mode=block");
        response.setHeader("Strict-Transport-Security", "max-age=31536000 ; includeSubDomains");
        response.setHeader("Content-Security-Policy", "default-src 'self' 'elem' 'unsafe-inline'; script-src 'self' 'unsafe-inline' 'elem'; style-src 'self' 'unsafe-inline' 'elem'; img-src 'self' data:;");
        response.setHeader("Referrer-Policy", "same-origin");
        response.setHeader("Set-Cookie", "name=value; Secure; HttpOnly");

        filterChain.doFilter(request, response);
    }

    @Override
    public void destroy() {}
}
