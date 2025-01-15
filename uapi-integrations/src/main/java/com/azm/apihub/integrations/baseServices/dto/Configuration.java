package com.azm.apihub.integrations.baseServices.dto;

import java.sql.Timestamp;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Configuration {
    private Long id;
    private String name;
    private String type;
    private String handle;
    private Timestamp createdAt;
}

