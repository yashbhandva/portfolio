package com.business.portfolio.controller;

import com.business.portfolio.dto.ApiResponse;
import com.business.portfolio.repository.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/client")
@CrossOrigin(origins = "http://localhost:4200")
public class ClientController {

    @Autowired
    private ContactRepository contactRepository;

    @GetMapping("/messages/count")
    public ResponseEntity<ApiResponse<Long>> getMyMessagesCount(@RequestParam String email) {
        try {
            long count = contactRepository.countByEmail(email);
            return ResponseEntity.ok(new ApiResponse<>("success", "Messages count retrieved", count));
        } catch (Exception e) {
            return ResponseEntity.ok(new ApiResponse<>("error", "Failed to get messages count", 0L));
        }
    }
}