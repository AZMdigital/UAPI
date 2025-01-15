package com.azm.apihub.backend.companies.models;

import com.azm.apihub.backend.users.models.UserRequest;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SubAccountRequest {
    String companyName;
    Boolean isActive;
    UserRequest user;
    Boolean allowPostpaidPackages;
    String subAccountDescription;
    Boolean useMainAccountBundles;

}