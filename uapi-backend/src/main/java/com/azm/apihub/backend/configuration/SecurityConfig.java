package com.azm.apihub.backend.configuration;

import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.session.SessionRegistryImpl;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.session.RegisterSessionAuthenticationStrategy;
import org.springframework.security.web.authentication.session.SessionAuthenticationStrategy;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
@EnableWebSecurity
@Profile("!local")
public class SecurityConfig {

    private @Value("${apiHub.enable-whitelisting-ips}") Boolean enableWhitelistingIps;
    private @Value("${apiHub.whitelisted-ips}") List<String> whitelistedIps;

    private CustomAuthenticationEntryPoint customAuthenticationEntryPoint;

    SecurityConfig(CustomAuthenticationEntryPoint customAuthenticationEntryPoint) {
        this.customAuthenticationEntryPoint = customAuthenticationEntryPoint;
    }
    @Bean
    protected SessionAuthenticationStrategy sessionAuthenticationStrategy() {
        return new RegisterSessionAuthenticationStrategy(new SessionRegistryImpl());
    }

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(new KeycloakRealmRoleConverter());
        return converter;
    }

    @Bean
    public String[] publicPaths() {
        return new String[]{
                "/v1/users/portal/token",
                "/v1/users/admin/token",
                "/v1/users/refreshToken",
                "/v1/users/logout",
                "/v1/forgot-password",
                "/v1/forgot-password/validate",
                "/v1/forgot-password/reset",
                "/v1/set-password",
                "/v1/set-password/validate",
                "/v1/sadad/payment/notification",
                "/v1/service-heads/landing-page",
                "/v1/company-request-attachments",
                "/v1/company-requests",
                "/v1/company-request-lookups"
        };
    }

    @Bean
    public SecurityFilterChain clientFilterChain(HttpSecurity http) throws Exception {

        http.sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()
                .authorizeRequests(authorizeRequests ->
                                authorizeRequests
                                        .antMatchers(publicPaths()).permitAll()
//                                .antMatchers("/**")
//                                .hasRole(BackendConstants.ADMIN_ROLE)
                                        .antMatchers("/v1/users/**",
                                                "/v1/companies/**",
                                                "/v1/attachments/**",
                                                "/v1/configuration/**",
                                                "/v1/company-configuration/**",
                                                "/v1/packages/**",
                                                "/v1/roles/**",
                                                "/v1/permissions/**",
                                                "/v1/invoices/**",
                                                "/v1/lookups/**",
                                                "/v1/consumption-usage/**",
                                                "/v1/consumption/**",
                                                "/v1/callback-config/**",
                                                "/v1/service-callback/**",
                                                "/v1/service-providers/**",
                                                "/v1/service-heads/**",
                                                "/v1/original-service-heads/**",
                                                "/v1/service/**",
                                                "/v1/logging/**",
                                                "/v1/request-log/**",
                                                "/v1/callback-config/**",
                                                "/v1/client-certificate/**",
                                                "/v1/utility/**",
                                                "/v1/integration-request-log/**",
                                                "/v1/dashboard/**",
                                                "/v1/audit-logs/**",
                                                "/v1/public-key/**",
                                                "/v1/custom-header/**")
                                        .authenticated()
                                        .anyRequest().permitAll()
                )
                .oauth2ResourceServer(oauth2 ->
                        oauth2.jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter()))
                )
                .csrf().disable()
                .formLogin().disable()
                .httpBasic().disable().cors();


        http.oauth2Login()
                .and()
                .exceptionHandling().authenticationEntryPoint(customAuthenticationEntryPoint);

        // Register the IP whitelist filter
        http.addFilterBefore(new IpWhitelistFilter(
                        enableWhitelistingIps, whitelistedIps, new AntPathRequestMatcher("/v1/sadad/payment/notification")),
                UsernamePasswordAuthenticationFilter.class);

        return http.build();

    }

}
