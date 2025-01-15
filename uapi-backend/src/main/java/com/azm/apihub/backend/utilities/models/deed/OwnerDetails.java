package com.azm.apihub.backend.utilities.models.deed;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OwnerDetails {
    String ownerName;
    Object birthDate;
    String idNumber;
    String idType;
    String idTypeText;
    String ownerType;
    String nationality;
    Double owningArea;
    Double owningAmount;
    Integer constrained;
    Integer halt;
    Integer pawned;
    Integer testament;
}