package com.azm.apihub.backend.roles.models;

import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RoleRequest {
    private String name;
    private Boolean active;
    private List<String> permissions;
}
