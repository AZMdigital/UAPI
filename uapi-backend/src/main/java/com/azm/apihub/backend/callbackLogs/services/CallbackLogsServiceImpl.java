package com.azm.apihub.backend.callbackLogs.services;

import com.azm.apihub.backend.callbackLogs.entities.CallbackLogs;
import com.azm.apihub.backend.callbackLogs.models.CallbackLogsResponse;
import com.azm.apihub.backend.callbackLogs.repository.CallbackLogsRepository;
import com.azm.apihub.backend.exceptions.UnAuthorizedException;
import com.azm.apihub.backend.users.models.UserDetails;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
public class CallbackLogsServiceImpl implements CallbackLogsService {

    @Autowired
    private final CallbackLogsRepository callbackLogsRepository;

    @Autowired
    public CallbackLogsServiceImpl(CallbackLogsRepository callbackLogsRepository) {
        this.callbackLogsRepository = callbackLogsRepository;
    }

    @Override
    public CallbackLogsResponse findAllLogs(Long serviceId, Long companyId, LocalDate fromDate, LocalDate toDate,
                                            int pageNumber, int pageSize, boolean applyPagination) {

        UserDetails userDetails = getAuthenticatedUser();

        if (!isUserAuthorized(companyId)) {
            throw new UnAuthorizedException("You are not authorized to get logs for this company.");
        }

        PageRequest pageRequest = PageRequest.of(pageNumber - 1, pageSize);

        Page<CallbackLogs> logsPage = callbackLogsRepository.findAllLogs(
                serviceId, companyId, fromDate, toDate, pageRequest, applyPagination);

        List<CallbackLogs> callLogs = logsPage.getContent();
        long count = logsPage.getTotalElements();

        log.info("Found {} callback logs for company {} and service {}", count, companyId, serviceId);

        return new CallbackLogsResponse(count, callLogs);
    }

    @Override
    public void saveCallbackLogs(Long serviceId, Long companyId, String inboundRequestData, String outboundUrl,
                                 String outboundRequestData, String outboundResponse, String header,
                                 String error, Date inboundRequestReceivedAt, Date outboundRequestSentAt,
                                 Date outboundResponseReceivedAt) {

        UserDetails userDetails = getAuthenticatedUser();

        if (!isUserAuthorized(companyId)) {
            throw new UnAuthorizedException("You are not authorized to save logs for this company");
        }

        CallbackLogs callbackLogs = new CallbackLogs();
        callbackLogs.setId(UUID.randomUUID().toString());
        callbackLogs.setServiceId(serviceId);
        callbackLogs.setCompanyId(companyId);
        callbackLogs.setInboundRequestData(inboundRequestData);
        callbackLogs.setOutboundUrl(outboundUrl);
        callbackLogs.setOutboundRequestData(outboundRequestData);
        callbackLogs.setOutboundResponse(outboundResponse);
        callbackLogs.setHeader(header);
        callbackLogs.setError(error);
        callbackLogs.setCreatedAt(new Date());
        callbackLogs.setInboundRequestReceivedAt(inboundRequestReceivedAt);
        callbackLogs.setOutboundRequestSentAt(outboundRequestSentAt);
        callbackLogs.setOutboundResponseReceivedAt(outboundResponseReceivedAt);

        callbackLogsRepository.save(callbackLogs);

        log.info("Saved callback log for service {} and company {} by user {}", serviceId, companyId, userDetails.getUsername());
    }

    @Override
    public boolean isUserAuthorized(Long companyId) {
        UserDetails userDetails = getAuthenticatedUser();
        return userDetails.isAdmin() || userDetails.getCompany().getId().equals(companyId);
    }

    private UserDetails getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("You must be authenticated to access this resource.");
        }
        return (UserDetails) authentication.getPrincipal();
    }
}