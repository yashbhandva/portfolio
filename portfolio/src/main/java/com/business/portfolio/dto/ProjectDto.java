package com.business.portfolio.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ProjectDto {

    // Project Request (For Create/Update)
    @Data
    public static class ProjectRequest {
        @NotBlank
        private String title;

        private String description;
        private String category;
        private String technologies;
        private String projectUrl;
        private String githubUrl;
        private String imageUrl;
        private String clientName;
        private LocalDate projectDate;
        private boolean featured;
        private int displayOrder;
        private List<String> projectImages;
    }

    // Project Response
    @Data
    public static class ProjectResponse {
        private Long id;
        private String title;
        private String description;
        private String category;
        private String technologies;
        private String projectUrl;
        private String githubUrl;
        private String imageUrl;
        private String clientName;
        private LocalDate projectDate;
        private boolean featured;
        private int displayOrder;
        private List<String> projectImages;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }

    // Project List (For Portfolio)
    @Data
    public static class ProjectSummary {
        private Long id;
        private String title;
        private String description;
        private String category;
        private String imageUrl;
        private String projectUrl;
        private boolean featured;
    }
}