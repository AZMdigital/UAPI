package com.azm.apihub.backend.companies.models;

import com.azm.apihub.backend.entities.UserType;
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
    String username;
    String password;
    String email;
    String contactNo;
    UserType userType;
}
