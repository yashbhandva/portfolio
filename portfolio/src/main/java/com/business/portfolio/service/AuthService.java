package com.business.portfolio.service;

import com.business.portfolio.dto.AuthDto;
import com.business.portfolio.model.User;
import com.business.portfolio.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthDto.AuthResponse register(AuthDto.RegisterRequest request) {
        // Check if user already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("User already exists with this email");
        }

        // Create new user
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhoneNumber(request.getPhoneNumber());
        user.setCompany(request.getCompany());
        user.setWebsite(request.getWebsite());
        user.setRole(User.Role.CLIENT);

        User savedUser = userRepository.save(user);

        // Generate JWT token
        String token = jwtService.generateToken(savedUser);

        // Convert to DTO
        com.business.portfolio.dto.UserDto userDto = convertToDto(savedUser);

        return new AuthDto.AuthResponse(token, userDto);
    }

    public AuthDto.AuthResponse login(AuthDto.LoginRequest request) {
        // Find user by email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        // Check if user is enabled
        if (!user.isEnabled()) {
            throw new RuntimeException("Account is disabled");
        }

        // Generate JWT token
        String token = jwtService.generateToken(user);

        // Convert to DTO
        com.business.portfolio.dto.UserDto userDto = convertToDto(user);

        return new AuthDto.AuthResponse(token, userDto);
    }

    private com.business.portfolio.dto.UserDto convertToDto(User user) {
        com.business.portfolio.dto.UserDto userDto = new com.business.portfolio.dto.UserDto();
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
}