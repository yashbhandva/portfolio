package com.business.portfolio.dto;

import com.business.portfolio.model.Notification;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class NotificationDto {
    private Long id;
    private String title;
    private String message;
    private Notification.NotificationType type;
    private boolean isRead;
    private Long referenceId;
    private LocalDateTime createdAt;
}