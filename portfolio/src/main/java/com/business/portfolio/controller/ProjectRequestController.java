package com.business.portfolio.controller;

import com.business.portfolio.dto.ApiResponse;
import com.business.portfolio.dto.ProjectRequestDto;
import com.business.portfolio.model.ProjectRequest;
import com.business.portfolio.service.ProjectRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class ProjectRequestController {

    private final ProjectRequestService projectRequestService;

    // 👤 CLIENT ENDPOINTS
    @PostMapping("/client/project-requests")
    public ResponseEntity<ApiResponse<ProjectRequestDto.ProjectRequestResponse>> createProjectRequest(
            @RequestAttribute("userId") Long clientId, // <-- FIXED: Use RequestAttribute
            @Valid @RequestBody ProjectRequestDto.CreateProjectRequest request) {
        try {
            ProjectRequestDto.ProjectRequestResponse projectRequest = projectRequestService.createProjectRequest(clientId, request);
            return ResponseEntity.ok(ApiResponse.success("Project request submitted successfully", projectRequest));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/client/project-requests")
    public ResponseEntity<ApiResponse<List<ProjectRequestDto.ProjectRequestResponse>>> getClientRequests(
            @RequestAttribute("userId") Long clientId) { // <-- FIXED: Use RequestAttribute
        try {
            List<ProjectRequestDto.ProjectRequestResponse> requests = projectRequestService.getClientRequests(clientId);
            return ResponseEntity.ok(ApiResponse.success("Project requests retrieved successfully", requests));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    // 🛠️ ADMIN ENDPOINTS
    @GetMapping("/admin/project-requests")
    public ResponseEntity<ApiResponse<List<ProjectRequestDto.ProjectRequestResponse>>> getAllRequests() {
        try {
            List<ProjectRequestDto.ProjectRequestResponse> requests = projectRequestService.getAllRequests();
            return ResponseEntity.ok(ApiResponse.success("All project requests retrieved successfully", requests));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/admin/project-requests/{id}/status")
    public ResponseEntity<ApiResponse<ProjectRequestDto.ProjectRequestResponse>> updateRequestStatus(
            @PathVariable Long id,
            @Valid @RequestBody ProjectRequestDto.UpdateProjectRequestStatus request) {
        try {
            ProjectRequestDto.ProjectRequestResponse updatedRequest = projectRequestService.updateRequestStatus(id, request);
            return ResponseEntity.ok(ApiResponse.success("Project request status updated successfully", updatedRequest));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    // 🔍 SEARCH ENDPOINTS
    @GetMapping("/admin/project-requests/search/title")
    public ResponseEntity<ApiResponse<List<ProjectRequestDto.ProjectRequestResponse>>> searchRequestsByTitle(
            @RequestParam String title) {
        try {
            List<ProjectRequestDto.ProjectRequestResponse> requests = projectRequestService.searchRequestsByTitle(title);
            return ResponseEntity.ok(ApiResponse.success("Project requests found", requests));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/admin/project-requests/search/client")
    public ResponseEntity<ApiResponse<List<ProjectRequestDto.ProjectRequestResponse>>> searchRequestsByClientName(
            @RequestParam String clientName) {
        try {
            List<ProjectRequestDto.ProjectRequestResponse> requests = projectRequestService.searchRequestsByClientName(clientName);
            return ResponseEntity.ok(ApiResponse.success("Project requests found", requests));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/admin/project-requests/status/{status}")
    public ResponseEntity<ApiResponse<List<ProjectRequestDto.ProjectRequestResponse>>> getRequestsByStatus(
            @PathVariable ProjectRequest.ProjectStatus status) {
        try {
            List<ProjectRequestDto.ProjectRequestResponse> requests = projectRequestService.getRequestsByStatus(status);
            return ResponseEntity.ok(ApiResponse.success("Project requests retrieved successfully", requests));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/admin/project-requests/priority/{priority}")
    public ResponseEntity<ApiResponse<List<ProjectRequestDto.ProjectRequestResponse>>> getRequestsByPriority(
            @PathVariable ProjectRequest.Priority priority) {
        try {
            List<ProjectRequestDto.ProjectRequestResponse> requests = projectRequestService.getRequestsByPriority(priority);
            return ResponseEntity.ok(ApiResponse.success("Project requests retrieved successfully", requests));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
}