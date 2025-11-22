package com.business.portfolio.repository;

import com.business.portfolio.model.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ContactRepository extends JpaRepository<Contact, Long> {

    List<Contact> findByUserId(Long userId);
    List<Contact> findByStatus(Contact.ContactStatus status);

    @Query("SELECT c FROM Contact c ORDER BY c.createdAt DESC")
    List<Contact> findAllOrderByCreatedAtDesc();

    long countByStatus(Contact.ContactStatus status);

    List<Contact> findByUserEmail(String email);
    long countByEmail(String email);
}