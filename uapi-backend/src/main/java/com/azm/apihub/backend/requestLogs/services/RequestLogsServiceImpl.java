package com.azm.apihub.backend.requestLogs.services;

import com.azm.apihub.backend.companies.repository.CompanyPackageSelectedRepository;
import com.azm.apihub.backend.entities.Company;
import com.azm.apihub.backend.entities.CompanyPackageSelected;
import com.azm.apihub.backend.entities.RequestLogs;
import com.azm.apihub.backend.entities.ServiceHead;
import com.azm.apihub.backend.exceptions.BadRequestException;
import com.azm.apihub.backend.requestLogs.models.RequestLogUpdateRequest;
import com.azm.apihub.backend.requestLogs.repository.RequestLogsRepository;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Slf4j
@Service
public class RequestLogsServiceImpl implements RequestLogsService {

    @Autowired
    private RequestLogsRepository requestLogsRepository;

    @Override
    public RequestLogs addRequestLog(UUID requestId, Company company, com.azm.apihub.backend.entities.Service service, String method,
                                     Boolean isClientCredentialsUsed, Boolean isMockup, Boolean isPostpaid) {
        Optional<RequestLogs> result = requestLogsRepository.findByRequestUuid(requestId.toString());
        if(result.isPresent())
            throw new BadRequestException("Request is already logged, please use PUT endpoint to update the request");

        RequestLogs requestLogs = new RequestLogs();
        requestLogs.setRequestUuid(requestId.toString());
        requestLogs.setCompanyId(company.getId());
        requestLogs.setServiceId(service.getId());
        requestLogs.setIsSuccess(false);
        requestLogs.setRequestTime(Timestamp.from(Instant.now()));
        requestLogs.setIsClientCredentialsUsed(isClientCredentialsUsed);
        requestLogs.setIsMockup(isMockup);
        requestLogs.setIsPostpaid(isPostpaid);
        if(method != null)
            requestLogs.setMethods(method);

        return requestLogsRepository.save(requestLogs);
    }

    @Override
    public RequestLogs updateRequestLog(UUID requestId, RequestLogUpdateRequest request) {
        Optional<RequestLogs> result = requestLogsRepository.findByRequestUuid(requestId.toString());
        if(result.isEmpty())
            throw new BadRequestException("Request is not logged, please use POST endpoint to log the request");

        RequestLogs requestLogs = result.get();
        requestLogs.setCompanyPackageSelectedId(request.getSelectedPackageId());

        requestLogs.setResponseTime(Timestamp.from(Instant.now()));
        requestLogs.setResponseCode(request.getResponseCode());


        requestLogs.setIsSuccess(request.getResponseCode() >= 200 && request.getResponseCode() < 300);

        if(request.getMethod() != null)
            requestLogs.setMethods(request.getMethod());

        if(request.getErrorDescription() != null)
            requestLogs.setErrorDescription(request.getErrorDescription());

        if(request.getErrorCode() != null)
            requestLogs.setErrorCode(request.getErrorCode());

        requestLogs.setIsClientCredentialsUsed(request.getIsClientCredentialsUsed());
        requestLogs.setIsMockup(request.getIsMockup());
        return requestLogsRepository.save(requestLogs);
    }
}
