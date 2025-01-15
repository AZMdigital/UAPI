package com.azm.apihub.backend.dashboard.mapper;

import com.azm.apihub.backend.dashboard.models.TopConsumedServicesResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

@Slf4j
public class TopConsumedServicesRowMapper implements RowMapper<TopConsumedServicesResponse> {

    @Override
    public TopConsumedServicesResponse mapRow(ResultSet row, int i) throws SQLException {
        String serviceName = row.getString("service_name");
        Long noOfHits = row.getLong("no_of_hits");

        return new TopConsumedServicesResponse(
                noOfHits,
                serviceName
        );
    }
}

