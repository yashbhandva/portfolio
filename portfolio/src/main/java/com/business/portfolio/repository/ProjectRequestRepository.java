package com.business.portfolio.repository;

import com.business.portfolio.model.ProjectRequest;
import com.business.portfolio.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProjectRequestRepository extends JpaRepository<ProjectRequest, Long> {

    List<ProjectRequest> findByClient(User client);
    List<ProjectRequest> findByClientId(Long clientId);

    List<ProjectRequest> findByStatus(ProjectRequest.ProjectStatus status);

    List<ProjectRequest> findByAssignedTeamMemberId(Long teamMemberId);

    @Query("SELECT pr FROM ProjectRequest pr ORDER BY pr.createdAt DESC")
    List<ProjectRequest> findAllOrderByCreatedAtDesc();

    @Query("SELECT pr FROM ProjectRequest pr WHERE pr.client.id = :clientId ORDER BY pr.createdAt DESC")
    List<ProjectRequest> findByClientIdOrderByCreatedAtDesc(Long clientId);

    @Query("SELECT COUNT(pr) FROM ProjectRequest pr WHERE pr.status = :status")
    long countByStatus(ProjectRequest.ProjectStatus status);

    List<ProjectRequest> findByPriority(ProjectRequest.Priority priority);

    @Query("SELECT pr FROM ProjectRequest pr WHERE pr.assignedTeamMember.id IS NULL AND pr.status = 'APPROVED'")
    List<ProjectRequest> findApprovedRequestsWithoutAssignment();

    // 🔍 SEARCH BY PROJECT TITLE
    @Query("SELECT pr FROM ProjectRequest pr WHERE LOWER(pr.projectTitle) LIKE LOWER(CONCAT('%', :title, '%'))")
    List<ProjectRequest> findByProjectTitleContainingIgnoreCase(@Param("title") String title);

    // 🔍 SEARCH BY CLIENT NAME
    @Query("SELECT pr FROM ProjectRequest pr WHERE LOWER(pr.client.name) LIKE LOWER(CONCAT('%', :clientName, '%'))")
    List<ProjectRequest> findByClientNameContainingIgnoreCase(@Param("clientName") String clientName);

    // 🔍 SEARCH BY CLIENT EMAIL
    @Query("SELECT pr FROM ProjectRequest pr WHERE LOWER(pr.client.email) LIKE LOWER(CONCAT('%', :clientEmail, '%'))")
    List<ProjectRequest> findByClientEmailContainingIgnoreCase(@Param("clientEmail") String clientEmail);

    // 🔍 SEARCH BY STATUS AND TITLE
    @Query("SELECT pr FROM ProjectRequest pr WHERE pr.status = :status AND LOWER(pr.projectTitle) LIKE LOWER(CONCAT('%', :title, '%'))")
    List<ProjectRequest> findByStatusAndTitleContaining(@Param("status") ProjectRequest.ProjectStatus status, @Param("title") String title);

    // 🔍 SEARCH BY MULTIPLE STATUSES
    @Query("SELECT pr FROM ProjectRequest pr WHERE pr.status IN :statuses")
    List<ProjectRequest> findByStatusIn(@Param("statuses") List<ProjectRequest.ProjectStatus> statuses);

    // 📊 FIND BY BUDGET RANGE
    @Query("SELECT pr FROM ProjectRequest pr WHERE pr.budget BETWEEN :minBudget AND :maxBudget")
    List<ProjectRequest> findByBudgetRange(@Param("minBudget") Double minBudget, @Param("maxBudget") Double maxBudget);
}