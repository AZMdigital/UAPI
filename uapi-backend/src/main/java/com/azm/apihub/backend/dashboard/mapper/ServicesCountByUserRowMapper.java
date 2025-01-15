package com.azm.apihub.backend.dashboard.mapper;

import com.azm.apihub.backend.dashboard.models.ServicesCountByUserResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

@Slf4j
public class ServicesCountByUserRowMapper implements RowMapper<ServicesCountByUserResponse> {

    @Override
    public ServicesCountByUserResponse mapRow(ResultSet row, int i) throws SQLException {
        Long subscribedServicesCount = row.getLong("subscribed_service_count");
        Long unsubscribedServicesCount = row.getLong("unsubscribed_service_count");

        return new ServicesCountByUserResponse(
                subscribedServicesCount,
                unsubscribedServicesCount
        );
    }
}

