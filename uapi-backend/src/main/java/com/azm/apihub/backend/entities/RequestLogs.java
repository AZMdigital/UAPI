package com.azm.apihub.backend.entities;

import java.sql.Timestamp;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "request_logs", schema = "apihub")
public class RequestLogs {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "request_uuid", nullable = false)
    private String requestUuid;

    @Column(name = "company_id")
    private Long companyId;

    @Column(name = "service_id")
    private Long serviceId;

    @Column(name = "request_time", nullable = false)
    private Timestamp requestTime;

    @Column(name = "response_time")
    private Timestamp responseTime;

    @Column(name = "response_code")
    private Integer responseCode;

    @Column(name = "is_success", nullable = false)
    private Boolean isSuccess;

    @Column(name = "methods")
    private String methods;

    @Column(name = "error_code")
    private String errorCode;

    @Column(name = "error_description")
    private String errorDescription;

    @Column(name = "is_client_credentials_used")
    private Boolean isClientCredentialsUsed;

    @Column(name = "is_mockup")
    private Boolean isMockup;

    @Column(name = "is_postpaid")
    private Boolean isPostpaid;

//    @ManyToOne
//    @JoinColumn(name = "company_package_selected_id")
//    private CompanyPackageSelected companyPackageSelected;

    @Column(name = "company_package_selected_id")
    private Long companyPackageSelectedId;
}

