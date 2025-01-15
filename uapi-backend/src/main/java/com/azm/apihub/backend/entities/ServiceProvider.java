package com.azm.apihub.backend.entities;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import java.sql.Timestamp;
import java.util.Set;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "service_provider", schema = "apihub")
public class ServiceProvider {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "arabic_name")
    private String arabicName;

    @Column(name = "requires_service_head_credentials", nullable = false)
    private Boolean requiresServiceHeadCredentials;

    @Column(name = "client_credentials_allowed", nullable = false)
    private Boolean clientCredentialsAllowed;

    @Column(name = "created_at", nullable = false)
    private Timestamp createdAt;

    @Column(name = "updated_at", nullable = false)
    private Timestamp updatedAt;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "updated_by")
    private String updatedBy;

    @Column(name = "service_provider_code")
    private String serviceProviderCode;

    @Column(name = "description")
    private String description;

    @JsonManagedReference
    @OneToMany(mappedBy = "serviceProvider", fetch = FetchType.EAGER)
    private Set<ServiceAuthType> authTypes;

    @Column(name = "attachment")
    private byte[] attachment;

    @Column(name = "attachment_name")
    private String attachmentName;

}
