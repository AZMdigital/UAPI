package com.azm.apihub.backend.utilities.models.deed;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RealEstateDetails {
    Integer deedSerial;                 //Required
    String regionCode;
    String regionName;
    Integer cityCode;                   //Required
    String cityName;
    String realEstateTypeName;
    String landNumber;
    String planNumber;
    Double area;                        //Required
    String areaText;
    Integer districtCode;
    String districtName;
    String locationDescription;
    Integer constrained;                //Required
    Integer halt;                       //Required
    Integer pawned;                     //Required
    Integer testament;                  //Required
    Integer isNorthRiyadhExceptioned;   //Required
    RealEstateBorderDetails realEstateBorderDetails;
}