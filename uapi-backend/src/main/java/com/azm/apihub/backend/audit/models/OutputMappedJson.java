package com.azm.apihub.backend.audit.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OutputMappedJson {
    private String columnName;
    private String oldValue;
    private String newValue;
}