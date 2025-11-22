package com.business.portfolio.dto;

import com.business.portfolio.model.User;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class UserDto {
    private Long id;
    private String name;
    private String email;
    private String phoneNumber;
    private String company;
    private String website;
    private String bio;
    private User.Role role;
    private boolean enabled;
    private LocalDateTime createdAt;

    // For User Profile
    @Data
    public static class UserProfileDto {
        private Long id;
        private String profilePicture;
        private String address;
        private String city;
        private String state;
        private String country;
        private String postalCode;
        private String socialLinkedIn;
        private String socialTwitter;
        private String socialGitHub;
        private String skills;
        private String experience;
        private String education;
        private boolean emailNotifications;
        private boolean smsNotifications;
    }

    // For User Update
    @Data
    public static class UpdateUserRequest {
        private String name;
        private String phoneNumber;
        private String company;
        private String website;
        private String bio;
    }

    // For Password Change
    @Data
    public static class ChangePasswordRequest {
        @NotBlank
        private String currentPassword;

        @NotBlank
        @Size(min = 6)
        private String newPassword;
    }
}