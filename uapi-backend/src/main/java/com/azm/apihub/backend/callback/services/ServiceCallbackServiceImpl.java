package com.azm.apihub.backend.callback.services;

import com.azm.apihub.backend.callback.models.enums.CallbackStatus;
import com.azm.apihub.backend.callback.repositories.ServiceCallbackRepository;
import com.azm.apihub.backend.entities.ServiceCallback;
import org.springframework.security.core.context.SecurityContextHolder;
import com.azm.apihub.backend.users.models.UserDetails;
import com.azm.apihub.backend.exceptions.BadRequestException;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.Optional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class ServiceCallbackServiceImpl implements ServiceCallbackService {
    private final ServiceCallbackRepository serviceCallbackRepository;


    @Autowired
    public ServiceCallbackServiceImpl(ServiceCallbackRepository serviceCallbackRepository) {
        this.serviceCallbackRepository = serviceCallbackRepository;
    }

    @Override
    public ServiceCallback getServiceCallbackInfoTransactionId(String transactionId) {
        Optional<ServiceCallback> serviceCallback = serviceCallbackRepository.findAllByTransactionIdAndIsCompletedFalse(transactionId);

        if(serviceCallback.isEmpty())
            throw new BadRequestException("Service callback does not exists");

        return serviceCallback.get();
    }

    @Override
    public ServiceCallback createCallbackEntry(Long companyId, Long serviceId, String transactionId) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = userDetails.getUsername();
        Optional<ServiceCallback> serviceCallbackOptional = serviceCallbackRepository.findAllByTransactionIdAndIsCompletedFalse(transactionId);

        if(serviceCallbackOptional.isPresent())
            throw new BadRequestException("Service callback already exist for this transaction id");

        ServiceCallback serviceCallback = new ServiceCallback();
        serviceCallback.setCompanyId(companyId);
        serviceCallback.setServiceId(serviceId);
        serviceCallback.setTransactionId(transactionId);
        serviceCallback.setIsCompleted(false);
        serviceCallback.setCreatedAt(Timestamp.from(Instant.now()));
        serviceCallback.setUpdatedAt(Timestamp.from(Instant.now()));
        serviceCallback.setCreatedBy(username);
        serviceCallback.setUpdatedBy(username);

        return serviceCallbackRepository.save(serviceCallback);
    }

    @Override
    public ServiceCallback updateCallbackEntry(String transactionId) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = userDetails.getUsername();
        Optional<ServiceCallback> serviceCallbackOptional = serviceCallbackRepository.findAllByTransactionIdAndIsCompletedFalse(transactionId);

        if(serviceCallbackOptional.isEmpty())
            throw new BadRequestException("Callback transaction does not exist");

        ServiceCallback serviceCallback = serviceCallbackOptional.get();
        serviceCallback.setIsCompleted(true);
        serviceCallback.setUpdatedAt(Timestamp.from(Instant.now()));
        serviceCallback.setUpdatedBy(username);

        return serviceCallbackRepository.save(serviceCallback);
    }
}