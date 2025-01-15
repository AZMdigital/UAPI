package com.azm.apihub.integrations.callbackLogs.services;

import com.azm.apihub.integrations.callbackLogs.entities.CallbackLogs;
import com.azm.apihub.integrations.callbackLogs.repositories.CallbackLogsRepository;
import java.time.Instant;
import java.util.Date;
import java.util.Optional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Slf4j
@Service
public class CallbackLogsServiceImpl implements CallbackLogsService {

    private final CallbackLogsRepository callbackLogsRepository;

    public CallbackLogsServiceImpl(@Autowired CallbackLogsRepository callbackLogsRepository) {
        this.callbackLogsRepository = callbackLogsRepository;
    }


    @Override
    public void saveInboundCallbackLogs(String requestId, String url, String requestJson, String authData) {
        log.info("Saving inbound callback logs for {}", requestId);
        CallbackLogs callbackLogs = new CallbackLogs();
        callbackLogs.setId(requestId);
        callbackLogs.setInboundEndpoint(url);
        callbackLogs.setInboundRequestData(requestJson);
        callbackLogs.setAuthData(authData);
        callbackLogs.setCreatedAt(Date.from(Instant.now()));
        callbackLogs.setInboundRequestReceivedAt(Date.from(Instant.now()));


        callbackLogsRepository.save(callbackLogs);
        log.info("Saved inbound callback logs for {}", requestId);
    }

    @Override
    public void saveInboundCallbackLogs(String requestId, String header, String payload) {
        log.info("Updating inbound callback logs for {}", requestId);
        Optional<CallbackLogs> callbackLogsOptional = callbackLogsRepository.findById(requestId);
        if(callbackLogsOptional.isEmpty())
            log.error("Inbound Callback logs not found");

        CallbackLogs callbackLogs = callbackLogsOptional.get();
        if(header != null)
            callbackLogs.setHeader(header);
        if(payload != null)
            callbackLogs.setPayload(payload);
        callbackLogsRepository.save(callbackLogs);
        log.info("Updated inbound callback logs for {}", requestId);
    }

    @Override
    public void saveOutboundCallbackLogs(String requestId, String url, String requestJson, Long companyId, Long serviceId, Long serviceCallbackId) {
        log.info("Updating outbound callback logs for {}", requestId);
        Optional<CallbackLogs> callbackLogsOptional = callbackLogsRepository.findById(requestId);
        if(callbackLogsOptional.isEmpty())
            log.error("Callback logs not found");

        CallbackLogs callbackLogs = callbackLogsOptional.get();
        if(url != null && !url.isEmpty())
            callbackLogs.setOutboundUrl(url);
        if(requestJson != null && !requestJson.isEmpty())
            callbackLogs.setOutboundRequestData(requestJson);
        if(serviceCallbackId != null)
            callbackLogs.setServiceCallbackId(serviceCallbackId);
        if(serviceId != null)
            callbackLogs.setServiceId(serviceId);
        if(companyId != null)
            callbackLogs.setCompanyId(companyId);

        callbackLogs.setOutboundRequestSentAt(Date.from(Instant.now()));

        callbackLogsRepository.save(callbackLogs);
        log.info("Updated outbound callback logs for {}", requestId);
    }

    @Override
    public void saveOutboundCallbackLogs(String requestId, String response) {
        log.info("Updating outbound callback response log for {}", requestId);
        Optional<CallbackLogs> callbackLogsOptional = callbackLogsRepository.findById(requestId);
        if(callbackLogsOptional.isEmpty())
            log.error("Callback log not found");

        CallbackLogs callbackLogs = callbackLogsOptional.get();
        callbackLogs.setOutboundResponse(response);
        callbackLogs.setOutboundResponseReceivedAt(Date.from(Instant.now()));

        callbackLogsRepository.save(callbackLogs);
        log.info("Updated outbound callback response log for {}", requestId);
    }

    @Override
    public void saveOutboundCallbackLogsError(String requestId, String error) {
        log.info("Updating outbound callback error log for {}", requestId);
        Optional<CallbackLogs> callbackLogsOptional = callbackLogsRepository.findById(requestId);
        if(callbackLogsOptional.isEmpty())
            log.error("Callback log not found for this request");

        CallbackLogs callbackLogs = callbackLogsOptional.get();
        callbackLogs.setError(error);
        callbackLogs.setOutboundResponseReceivedAt(Date.from(Instant.now()));

        callbackLogsRepository.save(callbackLogs);
        log.info("Updated outbound callback error log for {}", requestId);
    }
}
