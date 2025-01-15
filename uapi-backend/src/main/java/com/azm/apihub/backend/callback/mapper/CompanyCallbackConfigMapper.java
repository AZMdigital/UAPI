package com.azm.apihub.backend.callback.mapper;

import com.azm.apihub.backend.callback.models.CompanyCallbackConfigDTO;
import com.azm.apihub.backend.entities.CompanyCallbackConfig;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper
public interface CompanyCallbackConfigMapper {
    CompanyCallbackConfigMapper INSTANCE = Mappers.getMapper(CompanyCallbackConfigMapper.class);

    @Mapping(source = "service.id", target = "serviceId")
    @Mapping(source = "service.name", target = "serviceName")
    @Mapping(source = "company.id", target = "companyId")
    @Mapping(source = "company.companyName", target = "companyName")
    CompanyCallbackConfigDTO toDto(CompanyCallbackConfig entity);

    @Mapping(source = "serviceId", target = "service.id")
    @Mapping(source = "companyId", target = "company.id")
    CompanyCallbackConfig toEntity(CompanyCallbackConfigDTO dto);

    List<CompanyCallbackConfigDTO> toDtoList(List<CompanyCallbackConfig> entities);
}
