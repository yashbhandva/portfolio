package com.business.portfolio.repository;

import com.business.portfolio.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    List<Project> findByCategory(String category);
    List<Project> findByFeaturedTrue();

    @Query("SELECT p FROM Project p ORDER BY p.displayOrder ASC, p.createdAt DESC")
    List<Project> findAllOrderByDisplayOrder();

    @Query("SELECT p FROM Project p WHERE p.featured = true ORDER BY p.displayOrder ASC")
    List<Project> findFeaturedProjects();

    List<Project> findByCategoryOrderByDisplayOrderAsc(String category);

    @Query("SELECT DISTINCT p.category FROM Project p")
    List<String> findDistinctCategories();

    long countByCategory(String category);

    // 🔍 SEARCH BY TITLE
    @Query("SELECT p FROM Project p WHERE LOWER(p.title) LIKE LOWER(CONCAT('%', :title, '%'))")
    List<Project> findByTitleContainingIgnoreCase(@Param("title") String title);

    // 🔍 SEARCH BY TECHNOLOGY
    @Query("SELECT p FROM Project p WHERE LOWER(p.technologies) LIKE LOWER(CONCAT('%', :technology, '%'))")
    List<Project> findByTechnologiesContainingIgnoreCase(@Param("technology") String technology);

    // 🔍 SEARCH BY TITLE OR DESCRIPTION
    @Query("SELECT p FROM Project p WHERE LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Project> findByTitleOrDescriptionContainingIgnoreCase(@Param("keyword") String keyword);

    // 🔍 SEARCH BY CATEGORY AND TITLE
    @Query("SELECT p FROM Project p WHERE p.category = :category AND LOWER(p.title) LIKE LOWER(CONCAT('%', :title, '%'))")
    List<Project> findByCategoryAndTitleContaining(@Param("category") String category, @Param("title") String title);

    // 🔍 SEARCH BY MULTIPLE CATEGORIES
    @Query("SELECT p FROM Project p WHERE p.category IN :categories")
    List<Project> findByCategories(@Param("categories") List<String> categories);

    // 📊 FIND BY CLIENT NAME
    @Query("SELECT p FROM Project p WHERE LOWER(p.clientName) LIKE LOWER(CONCAT('%', :clientName, '%'))")
    List<Project> findByClientNameContainingIgnoreCase(@Param("clientName") String clientName);
}