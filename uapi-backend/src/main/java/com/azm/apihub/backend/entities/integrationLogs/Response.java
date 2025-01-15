package com.azm.apihub.backend.entities.integrationLogs;

import com.azm.apihub.backend.utilities.models.MongoResponseBody;
import java.util.Map;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Response {
    private Integer status;
    private Map<String, String> headers;
    private MongoResponseBody body;

}
