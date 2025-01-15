package com.azm.apihub.backend.callback.services;

import com.azm.apihub.backend.callback.mapper.CompanyCallbackConfigMapper;
import com.azm.apihub.backend.callback.models.CompanyCallbackConfigDTO;
import com.azm.apihub.backend.callback.models.CompanyCallbackConfigRequest;
import com.azm.apihub.backend.callback.repositories.CompanyCallbackConfigRepository;
import com.azm.apihub.backend.companies.repository.CompanyRepository;
import com.azm.apihub.backend.entities.Company;
import com.azm.apihub.backend.entities.CompanyCallbackConfig;
import com.azm.apihub.backend.exceptions.BadRequestException;
import com.azm.apihub.backend.services.repository.ServiceRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Transactional
@Service
public class CompanyCallbackConfigServiceImpl implements CompanyCallbackConfigService {

    private final CompanyCallbackConfigRepository companyCallbackConfigRepository;
    private final ServiceRepository serviceRepository;
    private final CompanyRepository companyRepository;

    @Autowired
    public CompanyCallbackConfigServiceImpl(CompanyCallbackConfigRepository companyCallbackConfigRepository, ServiceRepository serviceRepository, CompanyRepository companyRepository) {
        this.companyCallbackConfigRepository = companyCallbackConfigRepository;
        this.serviceRepository = serviceRepository;
        this.companyRepository = companyRepository;
    }

    @Override
    public CompanyCallbackConfigDTO getCallbackUrlByCompanyIdAndServiceId(UUID requestId, Long companyId, Long serviceId) {
        Optional<CompanyCallbackConfig> companyCallbackConfig = companyCallbackConfigRepository.findByCompanyIdAndServiceId(companyId, serviceId);

        if(companyCallbackConfig.isEmpty())
            throw new BadRequestException("Company Service callback does not exists");

        return CompanyCallbackConfigMapper.INSTANCE.toDto(companyCallbackConfig.get());
    }

    @Override
    public CompanyCallbackConfigDTO addCompanyCallbackConfig(Company company, CompanyCallbackConfigRequest companyCallbackConfigRequest, String username, boolean isAdmin) {
        Optional<com.azm.apihub.backend.entities.Service> service = serviceRepository.findById(companyCallbackConfigRequest.getServiceId());
        if(service.isEmpty())
            throw new BadRequestException("Service with Id " + companyCallbackConfigRequest.getServiceId() + " does not exists");

        if(isAdmin)
            company = companyRepository.findById(companyCallbackConfigRequest.getCompanyId()).orElseThrow(
                    () -> new BadRequestException("Company with Id " + companyCallbackConfigRequest.getCompanyId() + " does not exists"));

        if(companyCallbackConfigRepository.existsByCompanyIdAndServiceId(company.getId(), service.get().getId()))
            throw new BadRequestException("Callback Config is already exists for this service");

        Timestamp timeNow = Timestamp.from(Instant.now());
        return CompanyCallbackConfigMapper.INSTANCE.toDto(
                companyCallbackConfigRepository.save(
                        CompanyCallbackConfig
                                .builder()
                                .service(service.get())
                                .company(company)
                                .callbackUrl(companyCallbackConfigRequest.getCallbackUrl())
                                .description(companyCallbackConfigRequest.getDescription())
                                .authHeaderKey(companyCallbackConfigRequest.getAuthHeaderKey())
                                .authHeaderValue(companyCallbackConfigRequest.getAuthHeaderValue())
                                .isActive(companyCallbackConfigRequest.getIsActive())
                                .createdAt(timeNow)
                                .createdBy(username)
                                .updatedAt(timeNow)
                                .build()
                ));
    }

    @Override
    public CompanyCallbackConfigDTO updateCompanyCallbackConfig(Long id, Company company, CompanyCallbackConfigRequest companyCallbackConfigRequest,
                                                                String username, boolean isAdmin, boolean isSuperAdmin) {
        Optional<CompanyCallbackConfig> companyCallbackConfig = companyCallbackConfigRepository.findById(id);
        if(companyCallbackConfig.isEmpty())
            throw new BadRequestException("Company callback config does not exists");

        if(!isAdmin && !isSuperAdmin && !Objects.equals(companyCallbackConfig.get().getCompany().getId(), company.getId()))
            throw new BadRequestException("Request Denied, you can't update this company callback config");

        if((isAdmin || isSuperAdmin) && Objects.nonNull(companyCallbackConfigRequest.getCompanyId()) &&
                !Objects.equals(companyCallbackConfig.get().getCompany().getId(), companyCallbackConfigRequest.getCompanyId())) {
            company = companyRepository.findById(companyCallbackConfigRequest.getCompanyId()).orElseThrow(
                    () -> new BadRequestException("Company with Id " + companyCallbackConfigRequest.getCompanyId() + " does not exists"));
            companyCallbackConfig.get().setCompany(company);
        }

        Optional<com.azm.apihub.backend.entities.Service> service = serviceRepository.findById(companyCallbackConfigRequest.getServiceId());
        if(service.isEmpty())
            throw new BadRequestException("Service with Id " + companyCallbackConfigRequest.getServiceId() + " does not exists");

        if((!Objects.equals(companyCallbackConfig.get().getCompany().getId(), companyCallbackConfigRequest.getCompanyId()) ||
                !Objects.equals(companyCallbackConfig.get().getService().getId(), companyCallbackConfigRequest.getServiceId()))
                &&
                companyCallbackConfigRepository.existsByCompanyIdAndServiceId(
                        companyCallbackConfigRequest.getCompanyId(), companyCallbackConfigRequest.getServiceId())) //Check any other config with companyId and ServiceId exists
            throw new BadRequestException("Callback Config is already exists for this service");

        companyCallbackConfig.get().setService(service.get());
        companyCallbackConfig.get().setCallbackUrl(companyCallbackConfigRequest.getCallbackUrl());
        companyCallbackConfig.get().setDescription(companyCallbackConfigRequest.getDescription());
        companyCallbackConfig.get().setAuthHeaderKey(companyCallbackConfigRequest.getAuthHeaderKey());
        companyCallbackConfig.get().setAuthHeaderValue(companyCallbackConfigRequest.getAuthHeaderValue());
        companyCallbackConfig.get().setIsActive(companyCallbackConfigRequest.getIsActive());
        companyCallbackConfig.get().setUpdatedAt(Timestamp.from(Instant.now()));
        companyCallbackConfig.get().setUpdatedBy(username);

        return CompanyCallbackConfigMapper.INSTANCE.toDto(companyCallbackConfigRepository.save(companyCallbackConfig.get()));
    }

    @Override
    public List<CompanyCallbackConfigDTO> findCallbackInfoByCompany(Long companyId) {
        return CompanyCallbackConfigMapper.INSTANCE.toDtoList(companyCallbackConfigRepository.findByCompanyId(companyId));
    }

    @Override
    public List<CompanyCallbackConfigDTO> findAll() {
        return CompanyCallbackConfigMapper.INSTANCE.toDtoList(companyCallbackConfigRepository.findAll());
    }

    @Override
    public void deleteCompanyCallbackConfig(Long id, Long companyId, String username, boolean isAdmin, boolean isSuperAdmin) {
        Optional<CompanyCallbackConfig> companyCallbackConfig = companyCallbackConfigRepository.findById(id);
        if(companyCallbackConfig.isEmpty())
            throw new BadRequestException("Company callback config does not exists");

        if(!isAdmin && !isSuperAdmin && !Objects.equals(companyCallbackConfig.get().getCompany().getId(), companyId))
            throw new BadRequestException("Request Denied, you can't delete this company callback config");

        companyCallbackConfigRepository.delete(companyCallbackConfig.get());
    }
}