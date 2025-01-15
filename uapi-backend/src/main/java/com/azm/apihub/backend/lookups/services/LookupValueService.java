package com.azm.apihub.backend.lookups.services;

import com.azm.apihub.backend.entities.LookupValue;
import java.util.List;
import java.util.UUID;

public interface LookupValueService {
    List<LookupValue> getAllLookupValues(UUID requestId);
    List<LookupValue> getLookupValuesByTypeId(long lookupTypeId);
}
