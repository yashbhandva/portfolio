package com.business.portfolio.repository;

import com.business.portfolio.model.TeamMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface TeamMemberRepository extends JpaRepository<TeamMember, Long> {

    List<TeamMember> findByActiveTrue();

    @Query("SELECT tm FROM TeamMember tm WHERE tm.active = true ORDER BY tm.displayOrder ASC")
    List<TeamMember> findActiveMembersOrdered();

    Optional<TeamMember> findByEmail(String email);

    @Query("SELECT tm FROM TeamMember tm WHERE tm.id IN (SELECT DISTINCT pr.assignedTeamMember.id FROM ProjectRequest pr WHERE pr.status = 'IN_PROGRESS')")
    List<TeamMember> findMembersWithActiveProjects();

    long countByActiveTrue();

    Boolean existsByEmail(String email);

    // 🔍 SEARCH BY NAME
    @Query("SELECT tm FROM TeamMember tm WHERE LOWER(tm.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<TeamMember> findByNameContainingIgnoreCase(@Param("name") String name);

    // 🔍 SEARCH BY POSITION
    @Query("SELECT tm FROM TeamMember tm WHERE LOWER(tm.position) LIKE LOWER(CONCAT('%', :position, '%'))")
    List<TeamMember> findByPositionContainingIgnoreCase(@Param("position") String position);

    // 🔍 SEARCH BY SKILLS
    @Query("SELECT tm FROM TeamMember tm WHERE LOWER(tm.skills) LIKE LOWER(CONCAT('%', :skill, '%'))")
    List<TeamMember> findBySkillsContainingIgnoreCase(@Param("skill") String skill);

    // 🔍 SEARCH ACTIVE MEMBERS BY NAME
    @Query("SELECT tm FROM TeamMember tm WHERE tm.active = true AND LOWER(tm.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<TeamMember> findActiveByNameContainingIgnoreCase(@Param("name") String name);

    // 📊 FIND BY POSITION AND ACTIVE STATUS
    @Query("SELECT tm FROM TeamMember tm WHERE tm.position = :position AND tm.active = :active")
    List<TeamMember> findByPositionAndActive(@Param("position") String position, @Param("active") boolean active);
}