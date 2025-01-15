package com.azm.apihub.backend.entities;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * @author Bashar Al-Shoubaki
 * @created 28/11/2023
 */

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CompanyAttachmentRequest {

    private Long attachmentId;
    private AttachmentType attachmentType;
}
