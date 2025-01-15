package com.azm.apihub.integrations.baseServices.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PublicKey {
    private Long id;

    private Company company;

    private byte[] publicKey;

    private String createdAt;

    private String fileType;

    private String fileName;
}