package com.business.portfolio.dto;

import com.business.portfolio.model.Contact;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ContactDto {

    @Data
    public static class ContactRequest {
        @NotBlank
        private String name;

        @NotBlank
        @Email
        private String email;

        private String phone;

        @NotBlank
        private String subject;

        @NotBlank
        private String message;
    }

    @Data
    public static class ContactResponse {
        private Long id;
        private String name;
        private String email;
        private String phone;
        private String subject;
        private String message;
        private String adminReply; // New field
        private Contact.ContactStatus status;
        private LocalDateTime createdAt;
        private LocalDateTime repliedAt; // New field
        private Long userId;
        private String userName;
    }

    @Data
    public static class UpdateContactStatus {
        private Contact.ContactStatus status;
    }
}