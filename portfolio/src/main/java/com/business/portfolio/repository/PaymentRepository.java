package com.business.portfolio.repository;

import com.business.portfolio.model.Payment;
import com.business.portfolio.model.ProjectRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    List<Payment> findByProjectRequest(ProjectRequest projectRequest);
    List<Payment> findByProjectRequestId(Long projectRequestId);

    List<Payment> findByStatus(Payment.PaymentStatus status);

    Optional<Payment> findByPaymentId(String paymentId);

    @Query("SELECT p FROM Payment p ORDER BY p.createdAt DESC")
    List<Payment> findAllOrderByCreatedAtDesc();

    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = 'COMPLETED'")
    Double getTotalRevenue();

    @Query("SELECT COUNT(p) FROM Payment p WHERE p.status = :status")
    long countByStatus(Payment.PaymentStatus status);

    @Query("SELECT p FROM Payment p WHERE p.projectRequest.client.id = :clientId")
    List<Payment> findByClientId(Long clientId);
}