package com.azm.apihub.backend.onboardCompanyRequests.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CompanyRequestAttachmentDTO {
    private Long companyRequestId;
    private Long attachmentId;
    private String attachmentType;
}