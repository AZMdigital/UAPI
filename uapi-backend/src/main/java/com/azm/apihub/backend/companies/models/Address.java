package com.azm.apihub.backend.companies.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Address {
    String country;
    String district;
    Long cityId;
    String buildingNumber;
    String postalCode;
    String secondaryNumber;
}

