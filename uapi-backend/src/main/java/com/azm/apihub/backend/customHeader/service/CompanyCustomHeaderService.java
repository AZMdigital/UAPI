package com.azm.apihub.backend.customHeader.service;

import com.azm.apihub.backend.customHeader.models.CompanyCustomHeaderRequest;
import com.azm.apihub.backend.customHeader.repository.CompanyCustomHeaderRepository;
import com.azm.apihub.backend.entities.CompanyCustomHeader;
import com.azm.apihub.backend.entities.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;

@Service
public class CompanyCustomHeaderService {

    @Autowired
    private CompanyCustomHeaderRepository repository;

    public List<CompanyCustomHeader> findAllByCompanyId(Long companyId) {
        return repository.findAllByCompanyId(companyId);
    }

    public List<CompanyCustomHeader> saveOrUpdateAll(List<CompanyCustomHeaderRequest> requestList, User user) {
        repository.deleteAllByCompanyId(user.getCompany().getId());
        Timestamp timeNow = Timestamp.from(Instant.now());
        return repository.saveAll(requestList.stream().map(o ->
                        CompanyCustomHeader
                                .builder()
                                .key(o.getKey())
                                .value(o.getValue())
                                .company(user.getCompany())
                                .createdAt(timeNow)
                                .createdBy(user.getUsername())
                                .updatedAt(timeNow)
                                .updatedBy(user.getUsername())
                                .build())
                .toList());
    }
}
