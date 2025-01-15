package com.azm.apihub.backend.utilities.models.deed;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DeedInfo {
    Double deedArea;
    String deedAreaText;
    Boolean isRealEstateConstrained;
    Boolean isRealEstateHalted;
    Boolean isRealEstateMortgaged;
    Boolean isRealEstateTestamented;
}