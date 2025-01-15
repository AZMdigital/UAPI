package com.azm.apihub.backend.utilities.models.deed;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DeedLimitsDetails {
    String northLimitName;
    String northLimitDescription;
    Double northLimitLength;            //Required
    String northLimitLengthChar;
    String southLimitName;
    String southLimitDescription;
    Double southLimitLength;            //Required
    String southLimitLengthChar;
    String eastLimitName;
    String eastLimitDescription;
    Double eastLimitLength;             //Required
    String eastLimitLengthChar;
    String westLimitName;
    String westLimitDescription;
    Double westLimitLength;             //Required
    String westLimitLengthChar;
}