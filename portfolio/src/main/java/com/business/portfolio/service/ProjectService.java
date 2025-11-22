package com.business.portfolio.service;

import com.business.portfolio.dto.ProjectDto;
import com.business.portfolio.model.Project;
import com.business.portfolio.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;

    // Get all projects for public display
    @Cacheable("projects")
    public List<ProjectDto.ProjectSummary> getAllProjects() {
        return projectRepository.findAllOrderByDisplayOrder()
                .stream()
                .map(this::convertToSummary)
                .collect(Collectors.toList());
    }

    // Admin method to get all projects as entities
    public List<Project> getAllProjectEntities() {
        return projectRepository.findAll();
    }

    // Admin method to save project entity
    @CacheEvict(value = "projects", allEntries = true)
    public Project saveProject(Project project) {
        return projectRepository.save(project);
    }

    // Fetch featured projects only
    public List<ProjectDto.ProjectSummary> getFeaturedProjects() {
        return projectRepository.findFeaturedProjects()
                .stream()
                .map(this::convertToSummary)
                .collect(Collectors.toList());
    }

    // Admin method to get full project details
    public ProjectDto.ProjectResponse getProjectById(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        return convertToResponse(project);
    }

    // Public method to get basic project info
    public ProjectDto.ProjectSummary getPublicProjectById(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        return convertToSummary(project);
    }

    @CacheEvict(value = "projects", allEntries = true)
    public ProjectDto.ProjectResponse createProject(ProjectDto.ProjectRequest request) {
        Project project = new Project();
        project.setTitle(request.getTitle());
        project.setDescription(request.getDescription());
        project.setCategory(request.getCategory());
        project.setTechnologies(request.getTechnologies());
        project.setProjectUrl(request.getProjectUrl());
        project.setGithubUrl(request.getGithubUrl());
        project.setImageUrl(request.getImageUrl());
        project.setClientName(request.getClientName());
        project.setProjectDate(request.getProjectDate());
        project.setFeatured(request.isFeatured());
        project.setDisplayOrder(request.getDisplayOrder());
        project.setProjectImages(request.getProjectImages());

        Project savedProject = projectRepository.save(project);
        return convertToResponse(savedProject);
    }

    public ProjectDto.ProjectResponse updateProject(Long id, ProjectDto.ProjectRequest request) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        if (request.getTitle() != null) project.setTitle(request.getTitle());
        if (request.getDescription() != null) project.setDescription(request.getDescription());
        if (request.getCategory() != null) project.setCategory(request.getCategory());
        if (request.getTechnologies() != null) project.setTechnologies(request.getTechnologies());
        if (request.getProjectUrl() != null) project.setProjectUrl(request.getProjectUrl());
        if (request.getGithubUrl() != null) project.setGithubUrl(request.getGithubUrl());
        if (request.getImageUrl() != null) project.setImageUrl(request.getImageUrl());
        if (request.getClientName() != null) project.setClientName(request.getClientName());
        if (request.getProjectDate() != null) project.setProjectDate(request.getProjectDate());

        project.setFeatured(request.isFeatured());
        project.setDisplayOrder(request.getDisplayOrder());
        if (request.getProjectImages() != null) project.setProjectImages(request.getProjectImages());

        Project updatedProject = projectRepository.save(project);
        return convertToResponse(updatedProject);
    }

    public void deleteProject(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        projectRepository.delete(project);
    }

    // Search projects by title
    public List<ProjectDto.ProjectSummary> searchProjectsByTitle(String title) {
        return projectRepository.findByTitleContainingIgnoreCase(title)
                .stream()
                .map(this::convertToSummary)
                .collect(Collectors.toList());
    }

    public List<ProjectDto.ProjectSummary> searchProjectsByTechnology(String technology) {
        return projectRepository.findByTechnologiesContainingIgnoreCase(technology)
                .stream()
                .map(this::convertToSummary)
                .collect(Collectors.toList());
    }

    public List<ProjectDto.ProjectSummary> searchProjects(String keyword) {
        return projectRepository.findByTitleOrDescriptionContainingIgnoreCase(keyword)
                .stream()
                .map(this::convertToSummary)
                .collect(Collectors.toList());
    }

    public List<ProjectDto.ProjectSummary> getProjectsByCategory(String category) {
        return projectRepository.findByCategoryOrderByDisplayOrderAsc(category)
                .stream()
                .map(this::convertToSummary)
                .collect(Collectors.toList());
    }

    public List<ProjectDto.ProjectSummary> getProjectsByCategories(List<String> categories) {
        return projectRepository.findByCategories(categories)
                .stream()
                .map(this::convertToSummary)
                .collect(Collectors.toList());
    }

    public List<String> getAllCategories() {
        return projectRepository.findDistinctCategories();
    }

    // Convert project entity to full response DTO
    private ProjectDto.ProjectResponse convertToResponse(Project project) {
        ProjectDto.ProjectResponse response = new ProjectDto.ProjectResponse();
        response.setId(project.getId());
        response.setTitle(project.getTitle());
        response.setDescription(project.getDescription());
        response.setCategory(project.getCategory());
        response.setTechnologies(project.getTechnologies());
        response.setProjectUrl(project.getProjectUrl());
        response.setGithubUrl(project.getGithubUrl());
        response.setImageUrl(project.getImageUrl());
        response.setClientName(project.getClientName());
        response.setProjectDate(project.getProjectDate());
        response.setFeatured(project.isFeatured());
        response.setDisplayOrder(project.getDisplayOrder());
        response.setProjectImages(project.getProjectImages());
        response.setCreatedAt(project.getCreatedAt());
        response.setUpdatedAt(project.getUpdatedAt());
        return response;
    }

    // Convert project entity to summary DTO
    private ProjectDto.ProjectSummary convertToSummary(Project project) {
        ProjectDto.ProjectSummary summary = new ProjectDto.ProjectSummary();
        summary.setId(project.getId());
        summary.setTitle(project.getTitle());
        summary.setDescription(project.getDescription());
        summary.setCategory(project.getCategory());
        summary.setImageUrl(project.getImageUrl());
        summary.setProjectUrl(project.getProjectUrl());
        summary.setFeatured(project.isFeatured());
        return summary;
    }
}