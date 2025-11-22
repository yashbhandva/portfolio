package com.business.portfolio.dto;

import com.business.portfolio.model.ProjectRequest;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class ProjectRequestDto {

    // Create Project Request
    @Data
    public static class CreateProjectRequest {
        @NotBlank
        private String projectTitle;

        private String projectDescription;
        private Long serviceId;
        private BigDecimal budget;
        private Integer timelineDays;
        private ProjectRequest.Priority priority;
        private String requirements;
    }

    // Project Request Response
    @Data
    public static class ProjectRequestResponse {
        private Long id;
        private String projectTitle;
        private String projectDescription;
        private BigDecimal budget;
        private Integer timelineDays;
        private ProjectRequest.ProjectStatus status;
        private ProjectRequest.Priority priority;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        // Nested DTOs
        private ServiceDto.ServiceResponse service;
        private UserDto client;
        private TeamMemberDto assignedTeamMember;
    }

    // Update Project Request Status
    @Data
    public static class UpdateProjectRequestStatus {
        private ProjectRequest.ProjectStatus status;
        private String adminNotes;
        private Long assignedTeamMemberId;
    }
}