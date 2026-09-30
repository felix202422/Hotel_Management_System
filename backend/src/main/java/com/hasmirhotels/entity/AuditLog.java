package com.hasmirhotels.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "audit_logs")
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long auditId;

    private String userId;

    private String username;

    private String action;

    private String description;

    private String entityType;

    private Long entityId;

    private String ipAddress;

    private LocalDateTime timestamp = LocalDateTime.now();
}
