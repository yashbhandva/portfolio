package com.business.portfolio.service;

import com.business.portfolio.dto.ProjectRequestDto;
import com.business.portfolio.model.ProjectRequest;
import com.business.portfolio.model.User;
import com.business.portfolio.repository.ProjectRequestRepository;
import com.business.portfolio.repository.UserRepository;
import com.business.portfolio.repository.ServiceRepository;
import com.business.portfolio.repository.TeamMemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectRequestService {

    private final ProjectRequestRepository projectRequestRepository;
    private final UserRepository userRepository;
    private final ServiceRepository serviceRepository;
    private final TeamMemberRepository teamMemberRepository;

    public ProjectRequestDto.ProjectRequestResponse createProjectRequest(
            Long clientId, ProjectRequestDto.CreateProjectRequest request) {

        User client = userRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client not found"));

        com.business.portfolio.model.Service service = serviceRepository.findById(request.getServiceId())
                .orElseThrow(() -> new RuntimeException("Service not found"));

        ProjectRequest projectRequest = new ProjectRequest();
        projectRequest.setClient(client);
        projectRequest.setService(service);
        projectRequest.setProjectTitle(request.getProjectTitle());
        projectRequest.setProjectDescription(request.getProjectDescription());
        projectRequest.setBudget(request.getBudget());
        projectRequest.setTimelineDays(request.getTimelineDays());
        projectRequest.setPriority(request.getPriority());

        ProjectRequest savedRequest = projectRequestRepository.save(projectRequest);
        return convertToResponse(savedRequest);
    }

    public List<ProjectRequestDto.ProjectRequestResponse> getClientRequests(Long clientId) {
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

        projectRequest.setStatus(request.getStatus());

        if (request.getAssignedTeamMemberId() != null) {
            projectRequest.setAssignedTeamMember(
                    teamMemberRepository.findById(request.getAssignedTeamMemberId())
                            .orElseThrow(() -> new RuntimeException("Team member not found"))
            );
        }

        ProjectRequest updatedRequest = projectRequestRepository.save(projectRequest);
        return convertToResponse(updatedRequest);
    }

    // 🔍 SEARCH METHODS
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
        return response;
    }
}