package com.azm.apihub.backend.users.models;

import com.azm.apihub.backend.companies.enums.AccountType;
import com.azm.apihub.backend.entities.Company;
import com.azm.apihub.backend.entities.Role;
import com.azm.apihub.backend.entities.User;
import java.util.Collection;
import java.util.Objects;
import org.springframework.security.core.GrantedAuthority;

public class UserDetails implements org.springframework.security.core.userdetails.UserDetails {


    private User user;
    public UserDetails(User user) {
        this.user = user;
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
        return user.getUsername();
    }

    @Override
    public boolean isAccountNonExpired() {
        return user.getIsActive();
    }

    @Override
    public boolean isAccountNonLocked() {
        return user.getIsActive();
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return user.getIsActive();
    }

    @Override
    public boolean isEnabled() {
        return user.getIsActive();
    }

    public Long getUserId() {
        return user.getId();
    }

    public String getEmail() {
        return user.getEmail();
    }

    public String getFirstName() {
        return user.getFirstName();
    }

    public String getLastName() {
        return user.getLastName();
    }

    public Company getCompany() {
        return user.getCompany();
    }

    public boolean isAdmin() {
        return user !=null && user.getCompany() == null;
    }

    public boolean isAccountSuperAdmin() {
        return user !=null && user.getCompany() != null && user.getIsSuperAdmin();
    }

    public boolean isSubAccount() {
        return user !=null && user.getCompany() != null
                && user.getCompany().getMainAccountId() != null
                && Objects.equals(user.getCompany().getAccountType(), AccountType.SUB.name());
    }

    public Role getRole() {
        return user.getRole();
    }
}
