package com.azm.apihub.integrations.configuration.dto;

import com.azm.apihub.integrations.baseServices.dto.Company;
import java.util.Collection;
import org.springframework.security.core.GrantedAuthority;

public class CompanyDetails implements org.springframework.security.core.userdetails.UserDetails {


    private Company company;
    public CompanyDetails(Company user) {
        this.company = user;
    }
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return null;
    }

    @Override
    public String getPassword() {
        return null;
    }

    @Override
    public String getUsername() {
        return String.valueOf(company.getCompanyEmail());
    }

    @Override
    public boolean isAccountNonExpired() {
        return company.getIsActive();
    }

    @Override
    public boolean isAccountNonLocked() {
        return company.getIsActive();
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return company.getIsActive();
    }

    @Override
    public boolean isEnabled() {
        return company.getIsActive();
    }

    public Company getCompany() {
        return company;
    }

}
