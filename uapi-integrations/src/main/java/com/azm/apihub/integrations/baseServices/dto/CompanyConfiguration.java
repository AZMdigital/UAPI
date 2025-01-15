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
public class CompanyConfiguration {
    private Long id;
    private Company company;
    private Configuration configuration;
    private String configValue;
    private Timestamp createdAt;
    private Timestamp updatedAt;
}

