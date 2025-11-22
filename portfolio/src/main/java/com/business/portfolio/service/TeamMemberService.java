package com.business.portfolio.service;

import com.business.portfolio.dto.TeamMemberDto;
import com.business.portfolio.model.TeamMember;
import com.business.portfolio.repository.TeamMemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TeamMemberService {

    private final TeamMemberRepository teamMemberRepository;

    public List<TeamMemberDto.TeamMemberResponse> getAllTeamMembers() {
        return teamMemberRepository.findActiveMembersOrdered()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public TeamMemberDto.TeamMemberResponse getTeamMemberById(Long id) {
        TeamMember teamMember = teamMemberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Team member not found"));
        return convertToResponse(teamMember);
    }

    public TeamMemberDto.TeamMemberResponse createTeamMember(TeamMemberDto.TeamMemberRequest request) {
        // Check if email already exists
        if (teamMemberRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Team member with this email already exists");
        }

        TeamMember teamMember = new TeamMember();
        teamMember.setName(request.getName());
        teamMember.setPosition(request.getPosition());
        teamMember.setEmail(request.getEmail());
        teamMember.setPhone(request.getPhone());
        teamMember.setProfilePicture(request.getProfilePicture());
        teamMember.setBio(request.getBio());
        teamMember.setSkills(request.getSkills());
        teamMember.setSocialLinkedIn(request.getSocialLinkedIn());
        teamMember.setSocialGitHub(request.getSocialGitHub());
        teamMember.setActive(request.isActive());
        teamMember.setDisplayOrder(request.getDisplayOrder());

        TeamMember savedMember = teamMemberRepository.save(teamMember);
        return convertToResponse(savedMember);
    }

    public TeamMemberDto.TeamMemberResponse updateTeamMember(Long id, TeamMemberDto.TeamMemberRequest request) {
        TeamMember teamMember = teamMemberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Team member not found"));

        if (request.getName() != null) teamMember.setName(request.getName());
        if (request.getPosition() != null) teamMember.setPosition(request.getPosition());
        if (request.getEmail() != null) teamMember.setEmail(request.getEmail());
        if (request.getPhone() != null) teamMember.setPhone(request.getPhone());
        if (request.getProfilePicture() != null) teamMember.setProfilePicture(request.getProfilePicture());
        if (request.getBio() != null) teamMember.setBio(request.getBio());
        if (request.getSkills() != null) teamMember.setSkills(request.getSkills());
        if (request.getSocialLinkedIn() != null) teamMember.setSocialLinkedIn(request.getSocialLinkedIn());
        if (request.getSocialGitHub() != null) teamMember.setSocialGitHub(request.getSocialGitHub());

        teamMember.setActive(request.isActive());
        teamMember.setDisplayOrder(request.getDisplayOrder());

        TeamMember updatedMember = teamMemberRepository.save(teamMember);
        return convertToResponse(updatedMember);
    }

    public void deleteTeamMember(Long id) {
        TeamMember teamMember = teamMemberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Team member not found"));
        teamMemberRepository.delete(teamMember);
    }

    // 🔍 SEARCH METHODS
    public List<TeamMemberDto.TeamMemberResponse> searchTeamMembersByName(String name) {
        return teamMemberRepository.findByNameContainingIgnoreCase(name)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<TeamMemberDto.TeamMemberResponse> searchTeamMembersByPosition(String position) {
        return teamMemberRepository.findByPositionContainingIgnoreCase(position)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<TeamMemberDto.TeamMemberResponse> searchTeamMembersBySkills(String skill) {
        return teamMemberRepository.findBySkillsContainingIgnoreCase(skill)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<TeamMemberDto.TeamMemberResponse> getActiveTeamMembers() {
        return teamMemberRepository.findByActiveTrue()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<TeamMemberDto.TeamMemberResponse> getTeamMembersWithActiveProjects() {
        return teamMemberRepository.findMembersWithActiveProjects()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public long getActiveTeamMembersCount() {
        return teamMemberRepository.countByActiveTrue();
    }

    private TeamMemberDto.TeamMemberResponse convertToResponse(TeamMember teamMember) {
        TeamMemberDto.TeamMemberResponse response = new TeamMemberDto.TeamMemberResponse();
        response.setId(teamMember.getId());
        response.setName(teamMember.getName());
        response.setPosition(teamMember.getPosition());
        response.setEmail(teamMember.getEmail());
        response.setPhone(teamMember.getPhone());
        response.setProfilePicture(teamMember.getProfilePicture());
        response.setBio(teamMember.getBio());
        response.setSkills(teamMember.getSkills());
        response.setSocialLinkedIn(teamMember.getSocialLinkedIn());
        response.setSocialGitHub(teamMember.getSocialGitHub());
        response.setActive(teamMember.isActive());
        response.setDisplayOrder(teamMember.getDisplayOrder());
        return response;
    }
}