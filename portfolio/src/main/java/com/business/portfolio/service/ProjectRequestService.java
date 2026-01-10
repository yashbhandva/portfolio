package com.business.portfolio.service;

import com.business.portfolio.dto.ProjectDto;
import com.business.portfolio.dto.ProjectRequestDto;
import com.business.portfolio.dto.ServiceDto;
import com.business.portfolio.dto.UserDto;
import com.business.portfolio.model.Notification;
import com.business.portfolio.model.Project;
import com.business.portfolio.model.ProjectRequest;
import com.business.portfolio.model.User;
import com.business.portfolio.repository.ProjectRepository;
import com.business.portfolio.repository.ProjectRequestRepository;
import com.business.portfolio.repository.UserRepository;
import com.business.portfolio.repository.ServiceRepository;
import com.business.portfolio.repository.TeamMemberRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectRequestService {

    private final ProjectRequestRepository projectRequestRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ServiceRepository serviceRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final NotificationService notificationService;
    private final ModelMapper modelMapper;

    public ProjectRequestDto.ProjectRequestResponse createProjectRequest(
            Long clientId, ProjectRequestDto.CreateProjectRequest request) {

        if (clientId == null) {
            throw new RuntimeException("User ID not found in token. Please login again.");
        }

        User client = userRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client not found"));

        if (request.getServiceId() == null) {
             throw new RuntimeException("Service ID is required");
        }

        com.business.portfolio.model.Service service = serviceRepository.findById(request.getServiceId())
                .orElseThrow(() -> new RuntimeException("Service not found with ID: " + request.getServiceId()));

        ProjectRequest projectRequest = new ProjectRequest();
        projectRequest.setClient(client);
        projectRequest.setService(service);
        projectRequest.setProjectTitle(request.getProjectTitle());
        projectRequest.setProjectDescription(request.getProjectDescription());
        projectRequest.setBudget(request.getBudget());
        projectRequest.setTimelineDays(request.getTimelineDays());
        projectRequest.setPriority(request.getPriority());

        ProjectRequest savedRequest = projectRequestRepository.save(projectRequest);

        // 🔔 Notify Admin
        notificationService.notifyAdmin(
            "New Project Request",
            "Client " + client.getName() + " has requested a new project: " + request.getProjectTitle(),
            Notification.NotificationType.PROJECT_REQUEST,
            savedRequest.getId()
        );

        return convertToResponse(savedRequest);
    }

    public ProjectDto.ProjectResponse approveAndCreateProject(Long projectRequestId) {
        ProjectRequest request = projectRequestRepository.findById(projectRequestId)
                .orElseThrow(() -> new RuntimeException("Project Request not found"));

        if (request.getStatus() != ProjectRequest.ProjectStatus.PENDING) {
            throw new RuntimeException("Project has already been actioned.");
        }

        // Create a new Project from the request
        Project project = new Project();
        project.setTitle(request.getProjectTitle());
        project.setDescription(request.getProjectDescription());
        project.setClientName(request.getClient().getName());
        project.setCategory(request.getService().getCategory());
        project.setTechnologies("Pending");
        project.setImageUrl("https://via.placeholder.com/300");
        project.setFeatured(false);
        
        Project savedProject = projectRepository.save(project);

        // Update request status
        request.setStatus(ProjectRequest.ProjectStatus.APPROVED);
        projectRequestRepository.save(request);

        // Notify client
        notificationService.createNotification(
            request.getClient(),
            "Project Approved!",
            "Your project '" + request.getProjectTitle() + "' has been approved and is now active.",
            Notification.NotificationType.PROJECT_UPDATE,
            savedProject.getId()
        );

        // Manual mapping to avoid ModelMapper issues
        ProjectDto.ProjectResponse response = new ProjectDto.ProjectResponse();
        response.setId(savedProject.getId());
        response.setTitle(savedProject.getTitle());
        response.setDescription(savedProject.getDescription());
        response.setCategory(savedProject.getCategory());
        response.setTechnologies(savedProject.getTechnologies());
        response.setImageUrl(savedProject.getImageUrl());
        response.setClientName(savedProject.getClientName());
        response.setFeatured(savedProject.isFeatured());
        response.setCreatedAt(savedProject.getCreatedAt());
        response.setUpdatedAt(savedProject.getUpdatedAt());
        
        return response;
    }

    public List<ProjectRequestDto.ProjectRequestResponse> getClientRequests(Long clientId) {
        if (clientId == null) {
            throw new RuntimeException("User ID not found in token. Please login again.");
        }
        return projectRequestRepository.findByClientIdOrderByCreatedAtDesc(clientId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<ProjectRequestDto.ProjectRequestResponse> getAllRequests() {
        return projectRequestRepository.findAllOrderByCreatedAtDesc()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public ProjectRequestDto.ProjectRequestResponse updateRequestStatus(
            Long requestId, ProjectRequestDto.UpdateProjectRequestStatus request) {

        ProjectRequest projectRequest = projectRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Project request not found"));

        ProjectRequest.ProjectStatus oldStatus = projectRequest.getStatus();
        projectRequest.setStatus(request.getStatus());

        if (request.getAssignedTeamMemberId() != null) {
            projectRequest.setAssignedTeamMember(
                    teamMemberRepository.findById(request.getAssignedTeamMemberId())
                            .orElseThrow(() -> new RuntimeException("Team member not found"))
            );
        }

        ProjectRequest updatedRequest = projectRequestRepository.save(projectRequest);

        // 🔔 Notify Client if status changed
        if (oldStatus != request.getStatus()) {
            notificationService.createNotification(
                projectRequest.getClient(),
                "Project Status Updated",
                "Your project '" + projectRequest.getProjectTitle() + "' status has been updated to " + request.getStatus(),
                Notification.NotificationType.PROJECT_UPDATE,
                updatedRequest.getId()
            );
        }

        return convertToResponse(updatedRequest);
    }

    // ... (rest of the methods)
    public List<ProjectRequestDto.ProjectRequestResponse> searchRequestsByTitle(String title) {
        return projectRequestRepository.findByProjectTitleContainingIgnoreCase(title)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<ProjectRequestDto.ProjectRequestResponse> searchRequestsByClientName(String clientName) {
        return projectRequestRepository.findByClientNameContainingIgnoreCase(clientName)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<ProjectRequestDto.ProjectRequestResponse> getRequestsByStatus(ProjectRequest.ProjectStatus status) {
        return projectRequestRepository.findByStatus(status)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<ProjectRequestDto.ProjectRequestResponse> getRequestsByPriority(ProjectRequest.Priority priority) {
        return projectRequestRepository.findByPriority(priority)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<ProjectRequestDto.ProjectRequestResponse> getRequestsByBudgetRange(Double minBudget, Double maxBudget) {
        return projectRequestRepository.findByBudgetRange(minBudget, maxBudget)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public long getRequestsCountByStatus(ProjectRequest.ProjectStatus status) {
        return projectRequestRepository.countByStatus(status);
    }

    private ProjectRequestDto.ProjectRequestResponse convertToResponse(ProjectRequest request) {
        ProjectRequestDto.ProjectRequestResponse response = new ProjectRequestDto.ProjectRequestResponse();
        response.setId(request.getId());
        response.setProjectTitle(request.getProjectTitle());
        response.setProjectDescription(request.getProjectDescription());
        response.setBudget(request.getBudget());
        response.setTimelineDays(request.getTimelineDays());
        response.setStatus(request.getStatus());
        response.setPriority(request.getPriority());
        response.setCreatedAt(request.getCreatedAt());
        response.setUpdatedAt(request.getUpdatedAt());

        // Map Service
        if (request.getService() != null) {
            ServiceDto.ServiceResponse serviceResponse = new ServiceDto.ServiceResponse();
            serviceResponse.setId(request.getService().getId());
            serviceResponse.setName(request.getService().getName());
            serviceResponse.setCategory(request.getService().getCategory());
            serviceResponse.setDescription(request.getService().getDescription());
            serviceResponse.setStartingPrice(request.getService().getStartingPrice());
            serviceResponse.setDeliveryDays(request.getService().getDeliveryDays());
            serviceResponse.setFeatures(request.getService().getFeatures());
            serviceResponse.setActive(request.getService().isActive());
            serviceResponse.setDisplayOrder(request.getService().getDisplayOrder());
            response.setService(serviceResponse);
        }

        // Map Client
        if (request.getClient() != null) {
            System.out.println("DEBUG: Mapping client for request " + request.getId());
            System.out.println("DEBUG: Client Name: " + request.getClient().getName());
            
            UserDto clientDto = new UserDto();
            clientDto.setId(request.getClient().getId());
            clientDto.setName(request.getClient().getName());
            clientDto.setEmail(request.getClient().getEmail());
            clientDto.setPhoneNumber(request.getClient().getPhoneNumber());
            clientDto.setCompany(request.getClient().getCompany());
            response.setClient(clientDto);
        } else {
            System.out.println("DEBUG: Client is NULL for request " + request.getId());
        }

        return response;
    }
}