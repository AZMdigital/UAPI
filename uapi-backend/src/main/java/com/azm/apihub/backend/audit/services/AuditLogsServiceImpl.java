package com.azm.apihub.backend.audit.services;

import com.azm.apihub.backend.audit.entities.AuditLogMapper;
import com.azm.apihub.backend.audit.entities.AuditLogs;
import com.azm.apihub.backend.audit.models.ApiHubUsernames;
import com.azm.apihub.backend.audit.models.AuditLogMapped;
import com.azm.apihub.backend.audit.models.AuditLogsResponse;
import com.azm.apihub.backend.audit.repository.ApiHubModulesRepository;
import com.azm.apihub.backend.audit.repository.AuditLogMapperRepository;
import com.azm.apihub.backend.audit.repository.AuditLogsRepository;
import com.azm.apihub.backend.audit.repository.CustomAuditLogsRepository;
import com.azm.apihub.backend.entities.ApiHubModules;
import com.azm.apihub.backend.entities.User;
import com.azm.apihub.backend.users.models.UserDetails;
import com.azm.apihub.backend.users.repository.UserRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.fge.jsonpatch.diff.JsonDiff;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import java.lang.reflect.Type;
import java.time.Instant;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.util.Pair;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;


@Slf4j
@Service
public class AuditLogsServiceImpl implements AuditLogsService {

    private final AuditLogsRepository auditLogsRepository;
    private final AuditLogMapperRepository auditLogMapperRepository;
    private final ApiHubModulesRepository apiHubModulesRepository;
    private final UserRepository userRepository;
    private final CustomAuditLogsRepository customAuditLogsRepository;

    public AuditLogsServiceImpl(@Autowired AuditLogsRepository auditLogsRepository,
                                @Autowired AuditLogMapperRepository auditLogMapperRepository,
                                @Autowired ApiHubModulesRepository apiHubModulesRepository,
                                @Autowired UserRepository userRepository,
                                @Autowired CustomAuditLogsRepository customAuditLogsRepository) {
        this.auditLogsRepository = auditLogsRepository;
        this.auditLogMapperRepository = auditLogMapperRepository;
        this.apiHubModulesRepository = apiHubModulesRepository;
        this.userRepository = userRepository;
        this.customAuditLogsRepository = customAuditLogsRepository;
    }

    @Override
    public void saveAuditLogs(Long updatedModuleId, String updatedModuleName, String moduleName, String oldValue,
                              String newValue, String description, String ipAddress, String action) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("You must be authenticated to access this resource.");
        }

        Pair<String, String > fianlJsonPair = mapValues(oldValue, newValue);

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        Optional<ApiHubModules> optionalModule = apiHubModulesRepository.findByModuleHandle(moduleName);

        AuditLogs auditLogs = new AuditLogs();
        auditLogs.setId(UUID.randomUUID().toString());
        auditLogs.setUpdatedModuleId(updatedModuleId);
        auditLogs.setModuleName(optionalModule.get().getModuleHandle());
        auditLogs.setOldValueJson(fianlJsonPair.getFirst());
        auditLogs.setNewValueJson(fianlJsonPair.getSecond());
        auditLogs.setDescription(description);
        auditLogs.setIpAddress(ipAddress);
        auditLogs.setAction(action);
        auditLogs.setUpdatedModuleName(updatedModuleName);

        auditLogs.setCreatedAt(Date.from(Instant.now()));
        auditLogs.setUpdatedAt(Date.from(Instant.now()));

        auditLogs.setUpdatedByCompanyId(userDetails.isAdmin() ? -1L : userDetails.getCompany().getId());
        auditLogs.setUpdatedByUserId(userDetails.isAdmin() ? -1 : userDetails.getUserId());
        auditLogs.setUpdatedByCompanyName(userDetails.isAdmin() ? "ADMIN" : userDetails.getCompany().getCompanyName());
        auditLogs.setUpdatedByUserName(userDetails.getUsername());

        auditLogsRepository.save(auditLogs);
    }

    @Override
    public AuditLogsResponse getAuditLogs(Long accountId, String updatedByUsername, String moduleName, String action,
                                          LocalDate fromDate, LocalDate toDate, int pageNumber, int pageSize, boolean applyPagination) {
        if(accountId != null)
            log.info("Finding Audit logs for account ==> {}", accountId);

        List<AuditLogs> auditLogs;
        long count;
        if(applyPagination) {
            Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");
            Pageable pageable = PageRequest.of(pageNumber-1, pageSize, sort);
            auditLogs = auditLogsRepository.getAuditLogs(accountId, updatedByUsername, moduleName, action, fromDate, toDate, pageable).getContent();
            count = auditLogsRepository.getAuditLogs(accountId, updatedByUsername, moduleName, action, fromDate, toDate, pageable).getTotalElements();
        } else {
            auditLogs = auditLogsRepository.getAuditLogsWithoutPagination(accountId, updatedByUsername, moduleName, action, fromDate, toDate);
            count = auditLogs.size();
        }

        log.info("Got Audit logs count ==> {}", count);

        return new AuditLogsResponse(count, auditLogs);
    }

    @Override
    public List<ApiHubModules> getAllModules() {
        return apiHubModulesRepository.findAll();
    }

    @Override
    public List<ApiHubUsernames> getAllUsernames(Long companyId) {
        List<User> userList = new ArrayList<>();
        List<ApiHubUsernames> usernames = new ArrayList<>();
        if (companyId != null)
            userList = userRepository.findAllByCompanyIdOrderByUserCodeDesc(companyId);
        else {
            List<String> uniqueUpdatedByUsernames = customAuditLogsRepository.findDistinctUpdatedByUsernames();
            uniqueUpdatedByUsernames.forEach(updatedByUsername -> {
                usernames.add(new ApiHubUsernames(-1L, updatedByUsername));
            });
        }

        usernames.addAll(userList.stream()
                .map(user -> new ApiHubUsernames(user.getId(), user.getUsername()))
                .toList());

        return usernames;
    }

    private Pair<String, String> mapValues(String oldValue, String newValue) {
        String finalOldJson = "";
        String finalUpdatedJson = "";
        try {
            Map<String, String> auditLogMapperMap = auditLogMapperRepository.findAll()
                    .stream()
                    .collect(Collectors.toMap(AuditLogMapper::getOldProperty, AuditLogMapper::getMappedProperty));

            Gson gson = new Gson();
            ObjectMapper mapper = new ObjectMapper();

            JsonNode oldNode = mapper.readTree(oldValue);
            JsonNode updatedNode = mapper.readTree(newValue);

            // Get delta json for old values and new values
            JsonNode diffOldJson = JsonDiff.asJson(updatedNode, oldNode);
            JsonNode diffUpdatedJson = JsonDiff.asJson(oldNode, updatedNode);

            // Convert Json to List
            List<AuditLogMapped> diffOldJsonList = convertJsonsToList(gson, diffOldJson);
            List<AuditLogMapped> diffUpdatedJsonList = convertJsonsToList(gson, diffUpdatedJson);

            // Map values from mapper
            mapValuesInJson(diffOldJsonList, auditLogMapperMap);
            mapValuesInJson(diffUpdatedJsonList, auditLogMapperMap);

            // Convert list to json for final output to be saved in db
            finalOldJson = gson.toJson(diffOldJsonList);
            finalUpdatedJson = gson.toJson(diffUpdatedJsonList);

        } catch (JsonProcessingException e) {
            log.error(e.getMessage());
        }

        return Pair.of(finalOldJson, finalUpdatedJson);
    }

    private List<AuditLogMapped> convertJsonsToList(Gson gson, JsonNode deltaJson) {
        Type type = new TypeToken<List<AuditLogMapped>>() {}.getType();
        return gson.fromJson(deltaJson.toString(), type);
    }

    private void mapValuesInJson(List<AuditLogMapped> deltaJsonList, Map<String, String> mapperMap) {
        for (AuditLogMapped oldRow : deltaJsonList) {
            String oldValueData = oldRow.getPath();

            if (mapperMap.containsKey(oldValueData)) {
                oldRow.setPath(mapperMap.get(oldValueData));
            }
        }
    }
}
