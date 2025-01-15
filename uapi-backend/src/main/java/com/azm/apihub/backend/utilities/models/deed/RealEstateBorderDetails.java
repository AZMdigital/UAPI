package com.azm.apihub.backend.utilities.models.deed;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RealEstateBorderDetails {
    String northLimitDescription;
    Double northLimitLength;            //Required
    String northLimitLengthChar;
    String southLimitDescription;
    Double southLimitLength;            //Required
    String southLimitLengthChar;
    String eastLimitDescription;
    Double eastLimitLength;             //Required
    String eastLimitLengthChar;
    String westLimitDescription;
    Double westLimitLength;             //Required
    String westLimitLengthChar;
}