package com.azm.apihub.backend.entities;

import javax.persistence.*;

import java.sql.Timestamp;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "company_request_notes", schema = "apihub")
public class OnboardCompanyRequestNotes {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_request_id", referencedColumnName = "id", nullable = false)
    private OnboardCompanyRequest onboardCompanyRequest;

    @Column(name = "request_section", nullable = false)
    private String requestSection;

    @Column(nullable = false)
    private String notes;

    @Column(name = "resolution_status", nullable = false)
    private String resolutionStatus;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Timestamp createdAt;

    @Column(name = "updated_by")
    private String updatedBy;

    @Column(name = "updated_at", nullable = false)
    private Timestamp updatedAt;
}
