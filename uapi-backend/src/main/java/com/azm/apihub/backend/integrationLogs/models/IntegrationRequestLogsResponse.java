package com.azm.apihub.backend.integrationLogs.models;

import com.azm.apihub.backend.entities.integrationLogs.IntegrationRequestLogs;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class IntegrationRequestLogsResponse {
    Long count;
    List<IntegrationRequestLogs> requestLogs;
}
