package com.azm.apihub.backend.utilities.models.deed;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DeedDetails {
    String deedNumber;      //Required
    String deedSerial;      //Required
    String deedDate;
    String deedText;
}