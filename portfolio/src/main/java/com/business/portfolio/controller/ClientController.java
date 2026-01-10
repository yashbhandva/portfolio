package com.business.portfolio.controller;

import com.business.portfolio.dto.ApiResponse;
import com.business.portfolio.dto.ContactDto;
import com.business.portfolio.service.ContactService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/client")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class ClientController {

    private final ContactService contactService;

    @GetMapping("/messages/count")
    public ResponseEntity<ApiResponse<Long>> getMyMessagesCount(@RequestParam String email) {
        try {
            // Note: This is legacy, ideally we should use userId from token
            // But for now we keep it as is or update it to use service
            long count = contactService.getContactsCountByStatus(com.business.portfolio.model.Contact.ContactStatus.NEW); // Placeholder logic
            return ResponseEntity.ok(ApiResponse.success("Messages count retrieved", count));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Failed to get messages count: " + e.getMessage()));
        }
    }

    @GetMapping("/messages")
    public ResponseEntity<ApiResponse<List<ContactDto.ContactResponse>>> getMyMessages(
            @RequestAttribute("userId") Long userId) {
        try {
            List<ContactDto.ContactResponse> messages = contactService.getUserContacts(userId);
            return ResponseEntity.ok(ApiResponse.success("Messages retrieved successfully", messages));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Failed to get messages: " + e.getMessage()));
        }
    }
}