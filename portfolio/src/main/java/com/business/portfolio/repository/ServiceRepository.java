package com.business.portfolio.repository;

import com.business.portfolio.model.Service;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ServiceRepository extends JpaRepository<Service, Long> {

    List<Service> findByCategory(String category);
    List<Service> findByActiveTrue();

    @Query("SELECT s FROM Service s WHERE s.active = true ORDER BY s.displayOrder ASC")
    List<Service> findActiveServicesOrdered();

    @Query("SELECT DISTINCT s.category FROM Service s WHERE s.active = true")
    List<String> findDistinctActiveCategories();

    List<Service> findByActiveTrueOrderByDisplayOrderAsc();

    long countByActiveTrue();

    // 🔍 SEARCH BY SERVICE NAME
    @Query("SELECT s FROM Service s WHERE LOWER(s.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Service> findByNameContainingIgnoreCase(@Param("name") String name);

    // 🔍 SEARCH BY CATEGORY AND NAME
    @Query("SELECT s FROM Service s WHERE s.category = :category AND LOWER(s.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Service> findByCategoryAndNameContaining(@Param("category") String category, @Param("name") String name);

    // 🔍 SEARCH BY NAME OR DESCRIPTION
    @Query("SELECT s FROM Service s WHERE LOWER(s.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(s.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Service> findByNameOrDescriptionContainingIgnoreCase(@Param("keyword") String keyword);

    // 🔍 SEARCH ACTIVE SERVICES BY NAME
    @Query("SELECT s FROM Service s WHERE s.active = true AND LOWER(s.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Service> findActiveByNameContainingIgnoreCase(@Param("name") String name);

    // 📊 FIND SERVICES BY PRICE RANGE
    @Query("SELECT s FROM Service s WHERE s.startingPrice BETWEEN :minPrice AND :maxPrice")
    List<Service> findByPriceRange(@Param("minPrice") Double minPrice, @Param("maxPrice") Double maxPrice);
}