package com.azm.apihub.backend.lookups.services;

import com.azm.apihub.backend.entities.LookupType;
import java.util.List;
import java.util.UUID;

public interface LookupTypeService {
    List<LookupType> getAllLookupTypes(UUID requestId);
}
