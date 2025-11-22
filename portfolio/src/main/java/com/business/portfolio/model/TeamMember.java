package com.business.portfolio.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.util.List;

@Entity
@Table(name = "team_members")
@Data
public class TeamMember {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    @NotBlank
    private String position;

    private String email;
    private String phone;
    private String profilePicture;
    private String bio;
    private String skills;
    private String socialLinkedIn;
    private String socialGitHub;
    private boolean active = true;
    private int displayOrder = 0;

    @OneToMany(mappedBy = "assignedTeamMember")
    private List<ProjectRequest> assignedProjects;
}