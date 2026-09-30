package com.fizzohotels.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long notificationId;

    private Long userId;

    private String title;

    private String message;

    private String type;

    private boolean isRead = false;

    private String relatedEntity;

    private Long relatedEntityId;

    private LocalDateTime createdAt = LocalDateTime.now();
}
