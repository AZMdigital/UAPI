package com.azm.apihub.backend.dashboard.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class NoOfAccountsByPackagesResponse {
    Long noOfAccounts;
    String packageType;
}