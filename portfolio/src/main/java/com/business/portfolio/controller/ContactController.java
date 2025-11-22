package com.business.portfolio.controller;

import com.business.portfolio.dto.ApiResponse;
import com.business.portfolio.dto.ContactDto;
import com.business.portfolio.model.Contact;
import com.business.portfolio.service.ContactService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class ContactController {

    private final ContactService contactService;

    // 📢 PUBLIC ENDPOINTS
    @PostMapping("/public/contact")
    public ResponseEntity<ApiResponse<ContactDto.ContactResponse>> createContact(
            @Valid @RequestBody ContactDto.ContactRequest request) {
        try {
            ContactDto.ContactResponse contact = contactService.createContact(request);
            return ResponseEntity.ok(ApiResponse.success("Contact message sent successfully", contact));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    // 🛠️ ADMIN ENDPOINTS
    @GetMapping("/admin/contacts/status/{status}")
    public ResponseEntity<ApiResponse<List<ContactDto.ContactResponse>>> getContactsByStatus(
            @PathVariable Contact.ContactStatus status) {
        try {
            List<ContactDto.ContactResponse> contacts = contactService.getContactsByStatus(status);
            return ResponseEntity.ok(ApiResponse.success("Contacts retrieved successfully", contacts));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/admin/contacts/{id}/status")
    public ResponseEntity<ApiResponse<ContactDto.ContactResponse>> updateContactStatus(
            @PathVariable Long id,
            @Valid @RequestBody ContactDto.UpdateContactStatus request) {
        try {
            ContactDto.ContactResponse contact = contactService.updateContactStatus(id, request);
            return ResponseEntity.ok(ApiResponse.success("Contact status updated successfully", contact));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/admin/contacts/user/{userId}")
    public ResponseEntity<ApiResponse<List<ContactDto.ContactResponse>>> getUserContacts(@PathVariable Long userId) {
        try {
            List<ContactDto.ContactResponse> contacts = contactService.getUserContacts(userId);
            return ResponseEntity.ok(ApiResponse.success("User contacts retrieved successfully", contacts));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
}