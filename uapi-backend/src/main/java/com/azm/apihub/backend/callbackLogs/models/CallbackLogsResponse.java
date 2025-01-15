package com.azm.apihub.backend.callbackLogs.models;

import java.util.List;
import com.azm.apihub.backend.callbackLogs.entities.CallbackLogs;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CallbackLogsResponse {
    private Long count;
    private List<CallbackLogs> callLogs;
}
