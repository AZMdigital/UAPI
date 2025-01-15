package com.azm.apihub.backend.companies.models;

import com.azm.apihub.backend.entities.Company;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CompanyResponse {
    boolean success;
    String message;
    List<Company> companies;
}
