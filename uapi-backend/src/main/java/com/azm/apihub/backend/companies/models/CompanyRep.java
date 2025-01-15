package com.azm.apihub.backend.companies.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CompanyRep {
    String firstName;
    String lastName;
    String nationalId;
    String email;
    String mobile;
    Long cityId;
}