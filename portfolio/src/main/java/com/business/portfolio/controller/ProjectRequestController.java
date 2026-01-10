package com.business.portfolio.controller;

import com.business.portfolio.dto.ApiResponse;
import com.business.portfolio.dto.ProjectDto;
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
            @RequestAttribute("userId") Long clientId,
            @Valid @RequestBody ProjectRequestDto.CreateProjectRequest request) {
        
        ProjectRequestDto.ProjectRequestResponse projectRequest = projectRequestService.createProjectRequest(clientId, request);
        return ResponseEntity.ok(ApiResponse.success("Project request submitted successfully", projectRequest));
    }

    @GetMapping("/client/project-requests")
    public ResponseEntity<ApiResponse<List<ProjectRequestDto.ProjectRequestResponse>>> getClientRequests(
            @RequestAttribute("userId") Long clientId) {
            
        List<ProjectRequestDto.ProjectRequestResponse> requests = projectRequestService.getClientRequests(clientId);
        return ResponseEntity.ok(ApiResponse.success("Project requests retrieved successfully", requests));
    }

    // 🛠️ ADMIN ENDPOINTS
    @GetMapping("/admin/project-requests")
    public ResponseEntity<ApiResponse<List<ProjectRequestDto.ProjectRequestResponse>>> getAllRequests() {
        List<ProjectRequestDto.ProjectRequestResponse> requests = projectRequestService.getAllRequests();
        return ResponseEntity.ok(ApiResponse.success("All project requests retrieved successfully", requests));
    }

    @PostMapping("/admin/project-requests/{id}/approve")
    public ResponseEntity<ApiResponse<ProjectDto.ProjectResponse>> approveAndCreateProject(@PathVariable Long id) {
        ProjectDto.ProjectResponse project = projectRequestService.approveAndCreateProject(id);
        return ResponseEntity.ok(ApiResponse.success("Project approved and created successfully", project));
    }

    @PutMapping("/admin/project-requests/{id}/status")
    public ResponseEntity<ApiResponse<ProjectRequestDto.ProjectRequestResponse>> updateRequestStatus(
            @PathVariable Long id,
            @Valid @RequestBody ProjectRequestDto.UpdateProjectRequestStatus request) {
        
        ProjectRequestDto.ProjectRequestResponse updatedRequest = projectRequestService.updateRequestStatus(id, request);
        return ResponseEntity.ok(ApiResponse.success("Project request status updated successfully", updatedRequest));
    }

    // ... (rest of the methods)
    @GetMapping("/admin/project-requests/search/title")
    public ResponseEntity<ApiResponse<List<ProjectRequestDto.ProjectRequestResponse>>> searchRequestsByTitle(
            @RequestParam String title) {
        
        List<ProjectRequestDto.ProjectRequestResponse> requests = projectRequestService.searchRequestsByTitle(title);
        return ResponseEntity.ok(ApiResponse.success("Project requests found", requests));
    }

    @GetMapping("/admin/project-requests/search/client")
    public ResponseEntity<ApiResponse<List<ProjectRequestDto.ProjectRequestResponse>>> searchRequestsByClientName(
            @RequestParam String clientName) {
        
        List<ProjectRequestDto.ProjectRequestResponse> requests = projectRequestService.searchRequestsByClientName(clientName);
        return ResponseEntity.ok(ApiResponse.success("Project requests found", requests));
    }

    @GetMapping("/admin/project-requests/status/{status}")
    public ResponseEntity<ApiResponse<List<ProjectRequestDto.ProjectRequestResponse>>> getRequestsByStatus(
            @PathVariable ProjectRequest.ProjectStatus status) {
        
        List<ProjectRequestDto.ProjectRequestResponse> requests = projectRequestService.getRequestsByStatus(status);
        return ResponseEntity.ok(ApiResponse.success("Project requests retrieved successfully", requests));
    }

    @GetMapping("/admin/project-requests/priority/{priority}")
    public ResponseEntity<ApiResponse<List<ProjectRequestDto.ProjectRequestResponse>>> getRequestsByPriority(
            @PathVariable ProjectRequest.Priority priority) {
        
        List<ProjectRequestDto.ProjectRequestResponse> requests = projectRequestService.getRequestsByPriority(priority);
        return ResponseEntity.ok(ApiResponse.success("Project requests retrieved successfully", requests));
    }
}