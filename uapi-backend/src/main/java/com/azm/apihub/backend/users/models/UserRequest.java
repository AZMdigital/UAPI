package com.azm.apihub.backend.users.models;

import com.azm.apihub.backend.entities.UserType;
import io.swagger.v3.oas.annotations.Hidden;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserRequest {
    String firstName;
    String lastName;
    String nationalId;
    String username;
    String email;
    String contactNo;
    UserType userType;
    Long companyId;
    Boolean isActive;
    @Hidden Boolean isDeleted;
    Long roleId;
}
