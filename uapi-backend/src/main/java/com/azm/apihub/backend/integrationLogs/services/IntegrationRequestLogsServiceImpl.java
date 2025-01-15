package com.azm.apihub.backend.integrationLogs.services;

import com.azm.apihub.backend.entities.integrationLogs.IntegrationRequestLogs;
import com.azm.apihub.backend.integrationLogs.models.IntegrationRequestLogsResponse;
import com.azm.apihub.backend.integrationLogs.models.enums.RequestStatus;
import com.azm.apihub.backend.integrationLogs.repository.IntegrationRequestLogsRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Slf4j
@Service
public class IntegrationRequestLogsServiceImpl implements IntegrationRequestLogsService {

    @Autowired
    private IntegrationRequestLogsRepository integrationRequestLogsRepository;

    @Override
    public IntegrationRequestLogsResponse findLogsByAccount(UUID requestId, Long accountId, String serviceName,
                                                            RequestStatus status, LocalDate fromDate, LocalDate toDate, int pageNumber, int pageSize) {
        Pageable pageable = PageRequest.of(pageNumber-1, pageSize, Sort.by("requestTime").descending());

        log.info("Finding integration logs for account ==> {}", accountId);

        Integer statusCodeLowerLimit = null;
        Integer statusCodeUpperLimit = null;
        if (status == RequestStatus.SUCCESS) {
            statusCodeLowerLimit = 200;
            statusCodeUpperLimit = 300;
        } else if(status == RequestStatus.FAILED) {
            statusCodeLowerLimit = 300;
            statusCodeUpperLimit = 999;
        }

        List<IntegrationRequestLogs> requestLogs = integrationRequestLogsRepository.getSearchResult(accountId, serviceName, fromDate, toDate, statusCodeLowerLimit, statusCodeUpperLimit, pageable).getContent();
        long count = integrationRequestLogsRepository.getSearchResult(accountId, serviceName, fromDate, toDate, statusCodeLowerLimit, statusCodeUpperLimit, pageable).getTotalElements();

        log.info("Got Integration logs count ==> {}", count);

        return new IntegrationRequestLogsResponse(count, requestLogs);
    }
}
