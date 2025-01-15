package com.azm.apihub.backend.utilities.models.deed;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DeedSuccessResponse {
    DeedDetails deedDetails;
    CourtDetails courtDetails;
    String deedStatus;
    DeedInfo deedInfo;
    List<OwnerDetails> ownerDetails;
    DeedLimitsDetails deedLimitsDetails;
    List<RealEstateDetails> realEstateDetails;
}
