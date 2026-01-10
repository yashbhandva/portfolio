package com.business.portfolio.security;

import com.business.portfolio.service.JwtService;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.Collections;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        System.out.println("DEBUG FILTER: Request to " + request.getRequestURI());

        final String jwt;
        final String userEmail;

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("DEBUG FILTER: No valid Bearer token found");
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(7);

        try {
            if (jwtService.validateToken(jwt)) {
                userEmail = jwtService.extractUsername(jwt);
                Long userId = jwtService.extractUserId(jwt);
                String userRole = jwtService.extractUserRole(jwt);

                System.out.println("DEBUG: Processing request for user: " + userEmail);
                System.out.println("DEBUG: Extracted Role from Token: " + userRole);

                if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    // Ensure role has ROLE_ prefix if not already present
                    String roleName = userRole.startsWith("ROLE_") ? userRole : "ROLE_" + userRole;
                    System.out.println("DEBUG: Assigned Authority: " + roleName);

                    SimpleGrantedAuthority authority = new SimpleGrantedAuthority(roleName);
                    
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userEmail,
                            null,
                            Collections.singletonList(authority)
                    );
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    // Add user ID to request attribute for use in controllers
                    request.setAttribute("userId", userId);
                    request.setAttribute("userRole", userRole);

                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    System.out.println("DEBUG: Authentication successful for " + userEmail);
                }
            }
        } catch (ExpiredJwtException | MalformedJwtException e) {
            System.out.println("DEBUG: Token validation failed: " + e.getMessage());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Token is invalid or expired");
            return;
        } catch (Exception e) {
            System.out.println("DEBUG: Unexpected authentication error: " + e.getMessage());
            e.printStackTrace();
        }

        filterChain.doFilter(request, response);
    }
}