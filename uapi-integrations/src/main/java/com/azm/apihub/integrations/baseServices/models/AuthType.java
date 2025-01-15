package com.azm.apihub.integrations.baseServices.models;

import java.sql.Timestamp;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class AuthType {

    private Long id;

    private String name;

    private String description;

    private Timestamp createdAt;
}

