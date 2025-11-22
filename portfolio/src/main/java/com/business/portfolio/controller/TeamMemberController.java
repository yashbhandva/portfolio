package com.business.portfolio.controller;

import com.business.portfolio.dto.ApiResponse;
import com.business.portfolio.dto.TeamMemberDto;
import com.business.portfolio.service.TeamMemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class TeamMemberController {

    private final TeamMemberService teamMemberService;

    // 📢 PUBLIC ENDPOINTS
    @GetMapping("/public/team")
    public ResponseEntity<ApiResponse<List<TeamMemberDto.TeamMemberResponse>>> getPublicTeam() {
        try {
            List<TeamMemberDto.TeamMemberResponse> teamMembers = teamMemberService.getActiveTeamMembers();
            return ResponseEntity.ok(ApiResponse.success("Team members retrieved successfully", teamMembers));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    // 🛠️ ADMIN ENDPOINTS
    @GetMapping("/admin/team")
    public ResponseEntity<ApiResponse<List<TeamMemberDto.TeamMemberResponse>>> getAllTeamMembers() {
        try {
            List<TeamMemberDto.TeamMemberResponse> teamMembers = teamMemberService.getAllTeamMembers();
            return ResponseEntity.ok(ApiResponse.success("Team members retrieved successfully", teamMembers));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/admin/team/{id}")
    public ResponseEntity<ApiResponse<TeamMemberDto.TeamMemberResponse>> getTeamMemberById(@PathVariable Long id) {
        try {
            TeamMemberDto.TeamMemberResponse teamMember = teamMemberService.getTeamMemberById(id);
            return ResponseEntity.ok(ApiResponse.success("Team member retrieved successfully", teamMember));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/admin/team")
    public ResponseEntity<ApiResponse<TeamMemberDto.TeamMemberResponse>> createTeamMember(
            @Valid @RequestBody TeamMemberDto.TeamMemberRequest request) {
        try {
            TeamMemberDto.TeamMemberResponse teamMember = teamMemberService.createTeamMember(request);
            return ResponseEntity.ok(ApiResponse.success("Team member created successfully", teamMember));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/admin/team/{id}")
    public ResponseEntity<ApiResponse<TeamMemberDto.TeamMemberResponse>> updateTeamMember(
            @PathVariable Long id,
            @Valid @RequestBody TeamMemberDto.TeamMemberRequest request) {
        try {
            TeamMemberDto.TeamMemberResponse teamMember = teamMemberService.updateTeamMember(id, request);
            return ResponseEntity.ok(ApiResponse.success("Team member updated successfully", teamMember));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/admin/team/{id}")
    public ResponseEntity<ApiResponse<String>> deleteTeamMember(@PathVariable Long id) {
        try {
            teamMemberService.deleteTeamMember(id);
            return ResponseEntity.ok(ApiResponse.success("Team member deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    // 🔍 SEARCH ENDPOINTS
    @GetMapping("/admin/team/search/name")
    public ResponseEntity<ApiResponse<List<TeamMemberDto.TeamMemberResponse>>> searchTeamMembersByName(
            @RequestParam String name) {
        try {
            List<TeamMemberDto.TeamMemberResponse> teamMembers = teamMemberService.searchTeamMembersByName(name);
            return ResponseEntity.ok(ApiResponse.success("Team members found", teamMembers));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/admin/team/search/position")
    public ResponseEntity<ApiResponse<List<TeamMemberDto.TeamMemberResponse>>> searchTeamMembersByPosition(
            @RequestParam String position) {
        try {
            List<TeamMemberDto.TeamMemberResponse> teamMembers = teamMemberService.searchTeamMembersByPosition(position);
            return ResponseEntity.ok(ApiResponse.success("Team members found", teamMembers));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/admin/team/search/skills")
    public ResponseEntity<ApiResponse<List<TeamMemberDto.TeamMemberResponse>>> searchTeamMembersBySkills(
            @RequestParam String skills) {
        try {
            List<TeamMemberDto.TeamMemberResponse> teamMembers = teamMemberService.searchTeamMembersBySkills(skills);
            return ResponseEntity.ok(ApiResponse.success("Team members found", teamMembers));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/admin/team/active-projects")
    public ResponseEntity<ApiResponse<List<TeamMemberDto.TeamMemberResponse>>> getTeamMembersWithActiveProjects() {
        try {
            List<TeamMemberDto.TeamMemberResponse> teamMembers = teamMemberService.getTeamMembersWithActiveProjects();
            return ResponseEntity.ok(ApiResponse.success("Team members with active projects retrieved successfully", teamMembers));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
}