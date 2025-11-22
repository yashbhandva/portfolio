package com.business.portfolio.service;

import com.business.portfolio.dto.PaymentDto;
import com.business.portfolio.model.Payment;
import com.business.portfolio.model.ProjectRequest;
import com.business.portfolio.repository.PaymentRepository;
import com.business.portfolio.repository.ProjectRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final ProjectRequestRepository projectRequestRepository;

    public PaymentDto.PaymentResponse createPayment(PaymentDto.CreatePayment request) {
        ProjectRequest projectRequest = projectRequestRepository.findById(request.getProjectRequestId())
                .orElseThrow(() -> new RuntimeException("Project request not found"));

        Payment payment = new Payment();
        payment.setProjectRequest(projectRequest);
        payment.setPaymentId(generatePaymentId());
        payment.setAmount(request.getAmount());
        payment.setMethod(request.getMethod());
        payment.setStatus(Payment.PaymentStatus.PENDING);

        Payment savedPayment = paymentRepository.save(payment);
        return convertToResponse(savedPayment);
    }

    public PaymentDto.PaymentResponse getPaymentById(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        return convertToResponse(payment);
    }

    public List<PaymentDto.PaymentResponse> getPaymentsByProjectRequest(Long projectRequestId) {
        return paymentRepository.findByProjectRequestId(projectRequestId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<PaymentDto.PaymentResponse> getPaymentsByClient(Long clientId) {
        return paymentRepository.findByClientId(clientId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public PaymentDto.PaymentResponse updatePaymentStatus(Long paymentId, PaymentDto.UpdatePaymentStatus request) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        payment.setStatus(request.getStatus());

        if (request.getStatus() == Payment.PaymentStatus.COMPLETED) {
            payment.setPaymentDate(java.time.LocalDateTime.now());
        }

        Payment updatedPayment = paymentRepository.save(payment);
        return convertToResponse(updatedPayment);
    }

    public List<PaymentDto.PaymentResponse> getPaymentsByStatus(Payment.PaymentStatus status) {
        return paymentRepository.findByStatus(status)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public Double getTotalRevenue() {
        Double revenue = paymentRepository.getTotalRevenue();
        return revenue != null ? revenue : 0.0;
    }

    public long getPaymentsCountByStatus(Payment.PaymentStatus status) {
        return paymentRepository.countByStatus(status);
    }

    public List<PaymentDto.PaymentResponse> getAllPayments() {
        return paymentRepository.findAllOrderByCreatedAtDesc()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    private String generatePaymentId() {
        return "PAY-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    private PaymentDto.PaymentResponse convertToResponse(Payment payment) {
        PaymentDto.PaymentResponse response = new PaymentDto.PaymentResponse();
        response.setId(payment.getId());
        response.setPaymentId(payment.getPaymentId());
        response.setAmount(payment.getAmount());
        response.setCurrency(payment.getCurrency());
        response.setStatus(payment.getStatus());
        response.setMethod(payment.getMethod());
        response.setPaymentDate(payment.getPaymentDate());
        response.setCreatedAt(payment.getCreatedAt());
        return response;
    }
}