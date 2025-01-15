package com.azm.apihub.integrations.mock.services;

import com.azm.apihub.integrations.baseServices.BaseService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;


@Slf4j
@Service
public class MockServiceImpl extends BaseService implements MockService {

    public MockServiceImpl() {
    }

    @Override
    public String getMockServiceData(String serviceHandle, Long serviceId) {
        return parseMockResponse(serviceHandle+".json");
    }
}
