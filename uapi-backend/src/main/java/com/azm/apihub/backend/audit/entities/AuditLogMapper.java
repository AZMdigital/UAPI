package com.azm.apihub.backend.audit.entities;

import lombok.*;

import javax.persistence.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "audit_log_mapper", schema = "apihub")
public class AuditLogMapper {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private String id;

    @Column(name = "old_property")
    private String oldProperty;

    @Column(name = "mapped_property")
    private String mappedProperty;
}


