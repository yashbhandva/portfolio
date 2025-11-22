package com.business.portfolio.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Table(name = "services")
@Data
public class Service {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    private String category; // WEB_DEV, MOBILE_APP, etc.

    @Column(length = 1000)
    private String description;

    private BigDecimal startingPrice;
    private Integer deliveryDays;
    private String features;
    private boolean active = true;
    private int displayOrder = 0;
}