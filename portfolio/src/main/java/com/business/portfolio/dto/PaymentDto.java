package com.business.portfolio.dto;

import com.business.portfolio.model.Payment;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class PaymentDto {

    // Create Payment
    @Data
    public static class CreatePayment {
        private Long projectRequestId;
        private BigDecimal amount;
        private Payment.PaymentMethod method;
    }

    // Payment Response
    @Data
    public static class PaymentResponse {
        private Long id;
        private String paymentId;
        private BigDecimal amount;
        private String currency;
        private Payment.PaymentStatus status;
        private Payment.PaymentMethod method;
        private LocalDateTime paymentDate;
        private LocalDateTime createdAt;

        private ProjectRequestDto.ProjectRequestResponse projectRequest;
    }

    // Update Payment Status
    @Data
    public static class UpdatePaymentStatus {
        private Payment.PaymentStatus status;
        private String transactionId;
    }
}