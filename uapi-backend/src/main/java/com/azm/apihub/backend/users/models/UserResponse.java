package com.azm.apihub.backend.users.models;

import com.azm.apihub.backend.entities.User;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {
    boolean success;
    String message;
    Long count;
    List<User> users;
}
