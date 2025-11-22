package com.business.portfolio.controller;

import com.business.portfolio.dto.ApiResponse;
import com.business.portfolio.dto.PaymentDto;
import com.business.portfolio.model.Payment;
import com.business.portfolio.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class PaymentController {

    private final PaymentService paymentService;

    // 👤 CLIENT ENDPOINTS
    @PostMapping("/client/payments")
    public ResponseEntity<ApiResponse<PaymentDto.PaymentResponse>> createPayment(
            @Valid @RequestBody PaymentDto.CreatePayment request) {
        try {
            PaymentDto.PaymentResponse payment = paymentService.createPayment(request);
            return ResponseEntity.ok(ApiResponse.success("Payment created successfully", payment));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/client/payments/project/{projectRequestId}")
    public ResponseEntity<ApiResponse<List<PaymentDto.PaymentResponse>>> getPaymentsByProjectRequest(
            @PathVariable Long projectRequestId) {
        try {
            List<PaymentDto.PaymentResponse> payments = paymentService.getPaymentsByProjectRequest(projectRequestId);
            return ResponseEntity.ok(ApiResponse.success("Payments retrieved successfully", payments));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/client/payments/my-payments")
    public ResponseEntity<ApiResponse<List<PaymentDto.PaymentResponse>>> getClientPayments(
            @RequestHeader("userId") Long clientId) {
        try {
            List<PaymentDto.PaymentResponse> payments = paymentService.getPaymentsByClient(clientId);
            return ResponseEntity.ok(ApiResponse.success("Payments retrieved successfully", payments));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    // 🛠️ ADMIN ENDPOINTS
    @GetMapping("/admin/payments")
    public ResponseEntity<ApiResponse<List<PaymentDto.PaymentResponse>>> getAllPayments() {
        try {
            List<PaymentDto.PaymentResponse> payments = paymentService.getAllPayments();
            return ResponseEntity.ok(ApiResponse.success("Payments retrieved successfully", payments));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/admin/payments/{id}")
    public ResponseEntity<ApiResponse<PaymentDto.PaymentResponse>> getPaymentById(@PathVariable Long id) {
        try {
            PaymentDto.PaymentResponse payment = paymentService.getPaymentById(id);
            return ResponseEntity.ok(ApiResponse.success("Payment retrieved successfully", payment));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/admin/payments/{id}/status")
    public ResponseEntity<ApiResponse<PaymentDto.PaymentResponse>> updatePaymentStatus(
            @PathVariable Long id,
            @Valid @RequestBody PaymentDto.UpdatePaymentStatus request) {
        try {
            PaymentDto.PaymentResponse payment = paymentService.updatePaymentStatus(id, request);
            return ResponseEntity.ok(ApiResponse.success("Payment status updated successfully", payment));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/admin/payments/status/{status}")
    public ResponseEntity<ApiResponse<List<PaymentDto.PaymentResponse>>> getPaymentsByStatus(
            @PathVariable Payment.PaymentStatus status) {
        try {
            List<PaymentDto.PaymentResponse> payments = paymentService.getPaymentsByStatus(status);
            return ResponseEntity.ok(ApiResponse.success("Payments retrieved successfully", payments));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/admin/payments/revenue/total")
    public ResponseEntity<ApiResponse<Double>> getTotalRevenue() {
        try {
            Double revenue = paymentService.getTotalRevenue();
            return ResponseEntity.ok(ApiResponse.success("Total revenue retrieved successfully", revenue));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
}