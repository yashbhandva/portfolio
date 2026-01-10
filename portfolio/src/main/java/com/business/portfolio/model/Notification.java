package com.business.portfolio.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "recipient_id")
    private User recipient; // The user who receives the notification

    private String title;
    private String message;
    
    @Enumerated(EnumType.STRING)
    private NotificationType type;

    private boolean isRead = false;
    
    private Long referenceId; // ID of the related entity (e.g., ProjectRequest ID)

    private LocalDateTime createdAt;

    public enum NotificationType {
        PROJECT_REQUEST,
        PROJECT_UPDATE,
        PAYMENT,
        SYSTEM
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}