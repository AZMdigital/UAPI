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
public class ServiceAuthType {
    private Long id;

    private AuthType authType;

    private Timestamp createdAt;

}
