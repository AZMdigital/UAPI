package com.azm.apihub.backend.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import java.sql.Timestamp;
import lombok.*;
import org.hibernate.annotations.TypeDef;

import javax.persistence.*;

@EqualsAndHashCode
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "reset_password_request" , schema = "apihub")
@TypeDef(name = "pgsql_enum", typeClass = PostgreSQLEnumType.class)
public class ResetPasswordRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "token", nullable = false)
    private String token;

    @JsonBackReference
    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumns({
            @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    })
    User user;

    @Column(name = "created_at", nullable = false)
    private Timestamp createdAt;

    @Column(name = "expiry_at", nullable = false)
    private Timestamp expiryAt;
}