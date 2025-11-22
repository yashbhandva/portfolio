package com.business.portfolio.repository;

import com.business.portfolio.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
    Boolean existsByEmail(String email);

    Optional<User> findByIdAndRole(Long id, User.Role role);
    List<User> findByRole(User.Role role);

    @Query("SELECT u FROM User u WHERE u.isEnabled = :enabled")
    List<User> findByEnabledStatus(boolean enabled);

    long countByRole(User.Role role);

    // 🔍 SEARCH BY NAME
    @Query("SELECT u FROM User u WHERE LOWER(u.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<User> findByNameContainingIgnoreCase(@Param("name") String name);

    // 🔍 SEARCH BY EMAIL
    @Query("SELECT u FROM User u WHERE LOWER(u.email) LIKE LOWER(CONCAT('%', :email, '%'))")
    List<User> findByEmailContainingIgnoreCase(@Param("email") String email);

    // 🔍 SEARCH BY NAME OR EMAIL
    @Query("SELECT u FROM User u WHERE LOWER(u.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<User> findByNameOrEmailContainingIgnoreCase(@Param("keyword") String keyword);

    // 📊 FIND BY ROLE AND NAME
    @Query("SELECT u FROM User u WHERE u.role = :role AND LOWER(u.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<User> findByRoleAndNameContaining(@Param("role") User.Role role, @Param("name") String name);
}