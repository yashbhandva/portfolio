package com.business.portfolio.controller;

import com.business.portfolio.dto.ApiResponse;
import com.business.portfolio.dto.ProjectDto;
import com.business.portfolio.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class ProjectController {

    private final ProjectService projectService;

    // PUBLIC ENDPOINTS
    @GetMapping("/public/projects")
    public ResponseEntity<ApiResponse<List<ProjectDto.ProjectSummary>>> getAllPublicProjects() {
        try {
            List<ProjectDto.ProjectSummary> projects = projectService.getAllProjects();
            return ResponseEntity.ok(ApiResponse.success("Projects retrieved successfully", projects));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/public/projects/featured")
    public ResponseEntity<ApiResponse<List<ProjectDto.ProjectSummary>>> getFeaturedProjects() {
        try {
            List<ProjectDto.ProjectSummary> projects = projectService.getFeaturedProjects();
            return ResponseEntity.ok(ApiResponse.success("Featured projects retrieved successfully", projects));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/public/projects/{id}")
    public ResponseEntity<ApiResponse<ProjectDto.ProjectSummary>> getPublicProjectById(@PathVariable Long id) {
        try {
            ProjectDto.ProjectSummary project = projectService.getPublicProjectById(id);
            return ResponseEntity.ok(ApiResponse.success("Project retrieved successfully", project));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/public/projects/category/{category}")
    public ResponseEntity<ApiResponse<List<ProjectDto.ProjectSummary>>> getProjectsByCategory(
            @PathVariable String category) {
        try {
            List<ProjectDto.ProjectSummary> projects = projectService.getProjectsByCategory(category);
            return ResponseEntity.ok(ApiResponse.success("Projects retrieved successfully", projects));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/public/categories")
    public ResponseEntity<ApiResponse<List<String>>> getAllCategories() {
        try {
            List<String> categories = projectService.getAllCategories();
            return ResponseEntity.ok(ApiResponse.success("Categories retrieved successfully", categories));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    // PUBLIC SEARCH ENDPOINTS
    @GetMapping("/public/projects/search/title")
    public ResponseEntity<ApiResponse<List<ProjectDto.ProjectSummary>>> searchProjectsByTitle(
            @RequestParam String title) {
        try {
            List<ProjectDto.ProjectSummary> projects = projectService.searchProjectsByTitle(title);
            return ResponseEntity.ok(ApiResponse.success("Projects found", projects));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/public/projects/search/technology")
    public ResponseEntity<ApiResponse<List<ProjectDto.ProjectSummary>>> searchProjectsByTechnology(
            @RequestParam String technology) {
        try {
            List<ProjectDto.ProjectSummary> projects = projectService.searchProjectsByTechnology(technology);
            return ResponseEntity.ok(ApiResponse.success("Projects found", projects));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/public/projects/search")
    public ResponseEntity<ApiResponse<List<ProjectDto.ProjectSummary>>> searchProjects(
            @RequestParam String keyword) {
        try {
            List<ProjectDto.ProjectSummary> projects = projectService.searchProjects(keyword);
            return ResponseEntity.ok(ApiResponse.success("Projects found", projects));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }


}