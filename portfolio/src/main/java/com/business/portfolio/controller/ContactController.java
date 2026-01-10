package com.business.portfolio.controller;

import com.business.portfolio.dto.ApiResponse;
import com.business.portfolio.dto.ContactDto;
import com.business.portfolio.service.ContactService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}