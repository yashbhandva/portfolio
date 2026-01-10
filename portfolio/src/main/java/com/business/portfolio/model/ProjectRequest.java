package com.business.portfolio.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "project_requests")
@Data
public class ProjectRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "client_id")
    @JsonIgnore
    private User client;

    @ManyToOne
    @JoinColumn(name = "service_id")
    private Service service;

    private String projectTitle;

    @Column(length = 2000)
    private String projectDescription;

    private BigDecimal budget;
    private Integer timelineDays;

    @Enumerated(EnumType.STRING)
    private ProjectStatus status = ProjectStatus.PENDING;

    @Enumerated(EnumType.STRING)
    private Priority priority = Priority.MEDIUM;

    private String requirementsDocument;

    @ManyToOne
    @JoinColumn(name = "assigned_team_member_id")
    @JsonIgnore
    private TeamMember assignedTeamMember;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public enum ProjectStatus {
        PENDING, APPROVED, IN_PROGRESS, COMPLETED, CANCELLED
    }

    public enum Priority {
        LOW, MEDIUM, HIGH, URGENT
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}