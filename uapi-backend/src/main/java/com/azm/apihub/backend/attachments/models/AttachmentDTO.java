package com.azm.apihub.backend.attachments.models;

import com.azm.apihub.backend.entities.AttachmentType;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.sql.Timestamp;

/**
 * @author Bashar Al-Shoubaki
 * @created 07/12/2023
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AttachmentDTO {

    private Long id;

    private String name;

    private String description;

    private AttachmentType attachmentType;

    private Timestamp createdAt;

    private Timestamp updatedAt;
}
