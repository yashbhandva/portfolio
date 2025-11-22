package com.business.portfolio.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class ServiceDto {

    // Service Request
    @Data
    public static class ServiceRequest {
        @NotBlank
        private String name;

        private String category;
        private String description;
        private BigDecimal startingPrice;
        private Integer deliveryDays;
        private String features;
        private boolean active;
        private int displayOrder;
    }

    // Service Response
    @Data
    public static class ServiceResponse {
        private Long id;
        private String name;
        private String category;
        private String description;
        private BigDecimal startingPrice;
        private Integer deliveryDays;
        private String features;
        private boolean active;
        private int displayOrder;
    }

    // Service for Public
    @Data
    public static class PublicService {
        private Long id;
        private String name;
        private String category;
        private String description;
        private BigDecimal startingPrice;
        private Integer deliveryDays;
        private String features;
    }
}