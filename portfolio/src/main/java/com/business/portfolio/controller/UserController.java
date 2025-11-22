package com.business.portfolio.controller;

import com.business.portfolio.dto.ApiResponse;
import com.business.portfolio.dto.UserDto;
import com.business.portfolio.model.User;
import com.business.portfolio.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class UserController {

    private final UserService userService;

    @GetMapping("/users/{id}")
    public ResponseEntity<ApiResponse<UserDto>> getUserById(@PathVariable Long id) {
        try {
            UserDto user = userService.getUserById(id);
            return ResponseEntity.ok(ApiResponse.success("User retrieved successfully", user));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<ApiResponse<UserDto>> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserDto.UpdateUserRequest request) {
        try {
            UserDto updatedUser = userService.updateUser(id, request);
            return ResponseEntity.ok(ApiResponse.success("User updated successfully", updatedUser));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/users/{id}/change-password")
    public ResponseEntity<ApiResponse<String>> changePassword(
            @PathVariable Long id,
            @Valid @RequestBody UserDto.ChangePasswordRequest request) {
        try {
            userService.changePassword(id, request);
            return ResponseEntity.ok(ApiResponse.success("Password changed successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/users/{id}/profile")
    public ResponseEntity<ApiResponse<UserDto.UserProfileDto>> getUserProfile(@PathVariable Long id) {
        try {
            UserDto.UserProfileDto profile = userService.getUserProfile(id);
            return ResponseEntity.ok(ApiResponse.success("Profile retrieved successfully", profile));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/users/{id}/profile")
    public ResponseEntity<ApiResponse<UserDto.UserProfileDto>> updateUserProfile(
            @PathVariable Long id,
            @Valid @RequestBody UserDto.UserProfileDto request) {
        try {
            UserDto.UserProfileDto updatedProfile = userService.updateUserProfile(id, request);
            return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updatedProfile));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    // 🔍 SEARCH ENDPOINTS
    @GetMapping("/users/search/name")
    public ResponseEntity<ApiResponse<List<UserDto>>> searchUsersByName(@RequestParam String name) {
        try {
            List<UserDto> users = userService.searchUsersByName(name);
            return ResponseEntity.ok(ApiResponse.success("Users found", users));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/users/search/email")
    public ResponseEntity<ApiResponse<List<UserDto>>> searchUsersByEmail(@RequestParam String email) {
        try {
            List<UserDto> users = userService.searchUsersByEmail(email);
            return ResponseEntity.ok(ApiResponse.success("Users found", users));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/users/search")
    public ResponseEntity<ApiResponse<List<UserDto>>> searchUsers(@RequestParam String keyword) {
        try {
            List<UserDto> users = userService.searchUsers(keyword);
            return ResponseEntity.ok(ApiResponse.success("Users found", users));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/users/role/{role}")
    public ResponseEntity<ApiResponse<List<UserDto>>> getUsersByRole(@PathVariable User.Role role) {
        try {
            List<UserDto> users = userService.getUsersByRole(role);
            return ResponseEntity.ok(ApiResponse.success("Users found", users));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
}