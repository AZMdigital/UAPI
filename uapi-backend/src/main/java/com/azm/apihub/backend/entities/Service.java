package com.azm.apihub.backend.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import java.sql.Timestamp;
import java.util.List;

import javax.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "service", schema = "apihub")
public class Service {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "arabic_name")
    private String arabicName;

    @Column(name = "handle", nullable = false)
    private String handle;

    @JsonManagedReference
    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumns({
            @JoinColumn(name = "pricing_id", referencedColumnName = "id")
    })
    private Pricing pricing;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive;

    @JsonBackReference
    @ManyToOne(cascade= CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "service_head_id", nullable = false)
    private ServiceHead serviceHead;

    @Column(name = "service_head_id", nullable = false, insertable = false, updatable = false)
    private Long serviceHeadId;

    @JsonBackReference
    @OneToMany(mappedBy = "service", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<CompanyService> companyServices;

    @Column(name = "created_at", nullable = false)
    private Timestamp createdAt;

    @Column(name = "updated_at", nullable = false)
    private Timestamp updatedAt;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "updated_by")
    private String updatedBy;

    @Column(name = "service_code")
    private String serviceCode;

    @Column(name = "pricing_type", nullable = false)
    private String pricingType;

    @Column(name = "is_mock", nullable = false)
    private Boolean isMock;

    @Column(name = "callback_enabled")
    private Boolean callbackEnabled;
}
