package com.business.portfolio.repository;

import com.business.portfolio.model.User;
import com.business.portfolio.model.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {

    Optional<UserProfile> findByUser(User user);
    Optional<UserProfile> findByUserId(Long userId);
    Boolean existsByUserId(Long userId);
}