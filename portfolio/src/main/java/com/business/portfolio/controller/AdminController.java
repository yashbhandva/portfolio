package com.business.portfolio.controller;

import com.business.portfolio.dto.ApiResponse;
import com.business.portfolio.model.*;
import com.business.portfolio.service.*;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class AdminController {

    private final ProjectService projectService;
    private final ServiceService serviceService;
    private final ContactService contactService;
    private final UserService userService;
    private final NotificationService notificationService;

    // Dashboard Stats
    @GetMapping("/dashboard/stats")
    public ResponseEntity<ApiResponse<Object>> getDashboardStats() {
        try {
            // Create stats object
            var stats = new Object() {
                public final long totalProjects = projectService.getAllProjectEntities().size();
                public final long totalServices = serviceService.getAllServiceEntities().size();
                public final long totalContacts = contactService.getAllContactEntities().size();
                public final long totalUsers = userService.getAllUserEntities().size();
            };
            
            return ResponseEntity.ok(ApiResponse.success("Dashboard stats retrieved successfully", stats));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Failed to get dashboard stats: " + e.getMessage()));
        }
    }

    // Projects Management
    @GetMapping("/projects")
    public ResponseEntity<ApiResponse<List<Project>>> getAllProjects() {
        try {
            List<Project> projects = projectService.getAllProjectEntities();
            return ResponseEntity.ok(ApiResponse.success("Projects retrieved successfully", projects));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Failed to get projects: " + e.getMessage()));
        }
    }

    @PostMapping("/projects")
    public ResponseEntity<ApiResponse<Project>> createProject(@RequestBody Project project) {
        try {
            Project savedProject = projectService.saveProject(project);
            return ResponseEntity.ok(ApiResponse.success("Project created successfully", savedProject));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Failed to create project: " + e.getMessage()));
        }
    }

    @PutMapping("/projects/{id}")
    public ResponseEntity<ApiResponse<Project>> updateProject(@PathVariable Long id, @RequestBody Project project) {
        try {
            project.setId(id);
            Project updatedProject = projectService.saveProject(project);
            return ResponseEntity.ok(ApiResponse.success("Project updated successfully", updatedProject));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Failed to update project: " + e.getMessage()));
        }
    }

    @DeleteMapping("/projects/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProject(@PathVariable Long id) {
        try {
            projectService.deleteProject(id);
            return ResponseEntity.ok(ApiResponse.success("Project deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Failed to delete project: " + e.getMessage()));
        }
    }

    // Services Management
    @GetMapping("/services")
    public ResponseEntity<ApiResponse<List<Service>>> getAllServices() {
        try {
            List<Service> services = serviceService.getAllServiceEntities();
            return ResponseEntity.ok(ApiResponse.success("Services retrieved successfully", services));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Failed to get services: " + e.getMessage()));
        }
    }

    @PostMapping("/services")
    public ResponseEntity<ApiResponse<Service>> createService(@RequestBody Service service) {
        try {
            Service savedService = serviceService.saveService(service);
            return ResponseEntity.ok(ApiResponse.success("Service created successfully", savedService));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Failed to create service: " + e.getMessage()));
        }
    }

    @PutMapping("/services/{id}")
    public ResponseEntity<ApiResponse<Service>> updateService(@PathVariable Long id, @RequestBody Service service) {
        try {
            service.setId(id);
            Service updatedService = serviceService.saveService(service);
            return ResponseEntity.ok(ApiResponse.success("Service updated successfully", updatedService));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Failed to update service: " + e.getMessage()));
        }
    }

    @DeleteMapping("/services/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteService(@PathVariable Long id) {
        try {
            serviceService.deleteService(id);
            return ResponseEntity.ok(ApiResponse.success("Service deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Failed to delete service: " + e.getMessage()));
        }
    }

    // Contacts Management
    @GetMapping("/contacts")
    public ResponseEntity<ApiResponse<List<Contact>>> getAllContacts() {
        try {
            List<Contact> contacts = contactService.getAllContactEntities();
            return ResponseEntity.ok(ApiResponse.success("Contacts retrieved successfully", contacts));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Failed to get contacts: " + e.getMessage()));
        }
    }

    // Users Management
    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<User>>> getAllUsers() {
        try {
            List<User> users = userService.getAllUserEntities();
            return ResponseEntity.ok(ApiResponse.success("Users retrieved successfully", users));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Failed to get users: " + e.getMessage()));
        }
    }

    // 🔔 Send Notification
    @PostMapping("/notifications/send")
    public ResponseEntity<ApiResponse<Void>> sendNotification(@RequestBody SendNotificationRequest request) {
        try {
            if (request.isBroadcast()) {
                notificationService.broadcastToAll(request.getTitle(), request.getMessage());
            } else if (request.getUserId() != null) {
                notificationService.sendToUser(request.getUserId(), request.getTitle(), request.getMessage());
            } else {
                throw new RuntimeException("Recipient not specified");
            }
            return ResponseEntity.ok(ApiResponse.success("Notification sent successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @Data
    public static class SendNotificationRequest {
        private Long userId;
        private String title;
        private String message;
        private boolean broadcast;
    }
}