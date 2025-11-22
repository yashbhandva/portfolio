package com.business.portfolio.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TeamMemberDto {

    // Team Member Request
    @Data
    public static class TeamMemberRequest {
        @NotBlank
        private String name;

        @NotBlank
        private String position;

        private String email;
        private String phone;
        private String profilePicture;
        private String bio;
        private String skills;
        private String socialLinkedIn;
        private String socialGitHub;
        private boolean active;
        private int displayOrder;
    }

    // Team Member Response
    @Data
    public static class TeamMemberResponse {
        private Long id;
        private String name;
        private String position;
        private String email;
        private String phone;
        private String profilePicture;
        private String bio;
        private String skills;
        private String socialLinkedIn;
        private String socialGitHub;
        private boolean active;
        private int displayOrder;
    }
}