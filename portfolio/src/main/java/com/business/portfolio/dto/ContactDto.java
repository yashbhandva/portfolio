package com.business.portfolio.dto;

import com.business.portfolio.model.Contact;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ContactDto {

    // Contact Request
    @Data
    public static class ContactRequest {
        @NotBlank(message = "Name is required")
        private String name;

        @NotBlank(message = "Email is required")
        @Email(message = "Email should be valid")
        private String email;

        private String phone;

        @NotBlank(message = "Subject is required")
        private String subject;

        @NotBlank(message = "Message is required")
        private String message;
    }

    // Contact Response
    @Data
    public static class ContactResponse {
        private Long id;
        private String name;
        private String email;
        private String phone;
        private String subject;
        private String message;
        private Contact.ContactStatus status;
        private LocalDateTime createdAt;
        private Long userId;
        private String userName;
    }

    // Contact Status Update
    @Data
    public static class UpdateContactStatus {
        private Contact.ContactStatus status;
        private String adminNotes;
    }
}