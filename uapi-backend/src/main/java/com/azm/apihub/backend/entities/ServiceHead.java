package com.azm.apihub.backend.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.Basic;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Transient;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "service_head", schema = "apihub")
public class ServiceHead {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "arabic_name")
    private String arabicName;

    @Column(name = "description")
    private String description;

    @ManyToOne(cascade=CascadeType.ALL)
    @JoinColumn(name = "service_provider_id")
    private ServiceProvider serviceProvider;

    @JsonBackReference
    @OneToMany(mappedBy = "serviceHead", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<AccountServiceHeadSubscription> accountServiceHeadSubscriptions;

    @ManyToOne
    @JoinColumn(name = "original_service_head_id")
    private OriginalServiceHead originalServiceHead;

    @Column(name = "sector")
    private String sector;

    @Column(name = "swagger_path")
    private String swaggerPath;

    @JsonIgnore
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "icon")
    private byte[] icon;

    @Column(name="icon_name")
    private String iconName;

    @Column(name = "active")
    private boolean active;


    @Column(name = "created_at", nullable = false)
    private Timestamp createdAt;

    @JsonManagedReference
    @OneToMany(mappedBy = "serviceHead", fetch = FetchType.EAGER, cascade=CascadeType.ALL, orphanRemoval = true)
    private List<Service> services = new ArrayList<>();

    @Column(name = "service_head_code")
    private String serviceHeadCode;

    @Column(name = "show_on_landing_page", nullable = false)
    private Boolean showOnLandingPage;
}
