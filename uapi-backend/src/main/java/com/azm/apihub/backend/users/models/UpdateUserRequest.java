package com.azm.apihub.backend.users.models;

import com.azm.apihub.backend.entities.UserType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UpdateUserRequest {
    String firstName;
    String lastName;
    String password;
    String contactNo;
    String nationalId;
    UserType userType;
    Long companyId;
    Boolean isActive;
    Boolean isDeleted;
    Long roleId;
}
