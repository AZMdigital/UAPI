package com.azm.apihub.backend.lookups.services;

import com.azm.apihub.backend.entities.*;
import com.azm.apihub.backend.lookups.repository.LookupTypeRepository;
import com.azm.apihub.backend.lookups.repository.LookupValueRepository;
import java.util.List;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class LookupServiceImpl implements LookupTypeService, LookupValueService {


    private final LookupTypeRepository lookupTypeRepository;
    private final LookupValueRepository lookupValueRepository;



    private final String BAD_REQUEST_SERVICE_DOES_NOT_EXIST = "Service does not exist";

    @Autowired
    public LookupServiceImpl(LookupTypeRepository lookupTypeRepository,
                             LookupValueRepository lookupValueRepository) {
        this.lookupTypeRepository = lookupTypeRepository;
        this.lookupValueRepository = lookupValueRepository;
    }

    @Override
    public List<LookupType> getAllLookupTypes(UUID requestId) {
        return lookupTypeRepository.findAll();
    }

    @Override
    public List<LookupValue> getAllLookupValues(UUID requestId) {
        return lookupValueRepository.findAll();
    }

    @Override
    public List<LookupValue> getLookupValuesByTypeId(long lookupTypeId) {
        return lookupValueRepository.findAllByLookupTypeId(lookupTypeId);
    }
}
