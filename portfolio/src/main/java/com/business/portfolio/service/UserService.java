package com.business.portfolio.service;

import com.business.portfolio.dto.UserDto;
import com.business.portfolio.model.User;
import com.business.portfolio.model.UserProfile;
import com.business.portfolio.repository.UserRepository;
import com.business.portfolio.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final PasswordEncoder passwordEncoder;

    public List<UserDto> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // Admin method to get all users as entities
    public List<User> getAllUserEntities() {
        return userRepository.findAll();
    }

    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return convertToDto(user);
    }

    public UserDto updateUser(Long id, UserDto.UpdateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getName() != null) user.setName(request.getName());
        if (request.getPhoneNumber() != null) user.setPhoneNumber(request.getPhoneNumber());
        if (request.getCompany() != null) user.setCompany(request.getCompany());
        if (request.getWebsite() != null) user.setWebsite(request.getWebsite());
        if (request.getBio() != null) user.setBio(request.getBio());

        User updatedUser = userRepository.save(user);
        return convertToDto(updatedUser);
    }

    public void changePassword(Long userId, UserDto.ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    public UserDto.UserProfileDto getUserProfile(Long userId) {
        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User profile not found"));
        return convertToProfileDto(profile);
    }

    public UserDto.UserProfileDto updateUserProfile(Long userId, UserDto.UserProfileDto request) {
        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElse(new UserProfile());

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        profile.setUser(user);
        if (request.getProfilePicture() != null) profile.setProfilePicture(request.getProfilePicture());
        if (request.getAddress() != null) profile.setAddress(request.getAddress());
        if (request.getCity() != null) profile.setCity(request.getCity());
        if (request.getState() != null) profile.setState(request.getState());
        if (request.getCountry() != null) profile.setCountry(request.getCountry());
        if (request.getPostalCode() != null) profile.setPostalCode(request.getPostalCode());
        if (request.getSocialLinkedIn() != null) profile.setSocialLinkedIn(request.getSocialLinkedIn());
        if (request.getSocialTwitter() != null) profile.setSocialTwitter(request.getSocialTwitter());
        if (request.getSocialGitHub() != null) profile.setSocialGitHub(request.getSocialGitHub());
        if (request.getSkills() != null) profile.setSkills(request.getSkills());
        if (request.getExperience() != null) profile.setExperience(request.getExperience());
        if (request.getEducation() != null) profile.setEducation(request.getEducation());

        profile.setEmailNotifications(request.isEmailNotifications());
        profile.setSmsNotifications(request.isSmsNotifications());

        UserProfile savedProfile = userProfileRepository.save(profile);
        return convertToProfileDto(savedProfile);
    }

    // 🔍 SEARCH METHODS
    public List<UserDto> searchUsersByName(String name) {
        return userRepository.findByNameContainingIgnoreCase(name)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<UserDto> searchUsersByEmail(String email) {
        return userRepository.findByEmailContainingIgnoreCase(email)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<UserDto> searchUsers(String keyword) {
        return userRepository.findByNameOrEmailContainingIgnoreCase(keyword)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<UserDto> getUsersByRole(User.Role role) {
        return userRepository.findByRole(role)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private UserDto convertToDto(User user) {
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setName(user.getName());
        userDto.setEmail(user.getEmail());
        userDto.setPhoneNumber(user.getPhoneNumber());
        userDto.setCompany(user.getCompany());
        userDto.setWebsite(user.getWebsite());
        userDto.setBio(user.getBio());
        userDto.setRole(user.getRole());
        userDto.setEnabled(user.isEnabled());
        userDto.setCreatedAt(user.getCreatedAt());
        return userDto;
    }

    private UserDto.UserProfileDto convertToProfileDto(UserProfile profile) {
        UserDto.UserProfileDto dto = new UserDto.UserProfileDto();
        dto.setId(profile.getId());
        dto.setProfilePicture(profile.getProfilePicture());
        dto.setAddress(profile.getAddress());
        dto.setCity(profile.getCity());
        dto.setState(profile.getState());
        dto.setCountry(profile.getCountry());
        dto.setPostalCode(profile.getPostalCode());
        dto.setSocialLinkedIn(profile.getSocialLinkedIn());
        dto.setSocialTwitter(profile.getSocialTwitter());
        dto.setSocialGitHub(profile.getSocialGitHub());
        dto.setSkills(profile.getSkills());
        dto.setExperience(profile.getExperience());
        dto.setEducation(profile.getEducation());
        dto.setEmailNotifications(profile.isEmailNotifications());
        dto.setSmsNotifications(profile.isSmsNotifications());
        return dto;
    }
}