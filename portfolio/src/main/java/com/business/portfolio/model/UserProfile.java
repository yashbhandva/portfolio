package com.business.portfolio.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "user_profiles")
@Data
public class UserProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String profilePicture;
    private String address;
    private String city;
    private String state;
    private String country;
    private String postalCode;

    private String socialLinkedIn;
    private String socialTwitter;
    private String socialGitHub;

    private String skills;
    private String experience;
    private String education;

    private boolean emailNotifications = true;
    private boolean smsNotifications = false;
}