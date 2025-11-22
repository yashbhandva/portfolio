package com.business.portfolio.controller;

import com.business.portfolio.dto.ApiResponse;
import com.business.portfolio.dto.ServiceDto;
import com.business.portfolio.service.ServiceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class ServiceController {

    private final ServiceService serviceService;

    // 📢 PUBLIC ENDPOINTS
    @GetMapping("/public/services")
    public ResponseEntity<ApiResponse<List<ServiceDto.PublicService>>> getAllPublicServices() {
        try {
            List<ServiceDto.PublicService> services = serviceService.getActiveServices();
            return ResponseEntity.ok(ApiResponse.success("Services retrieved successfully", services));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/public/services/{id}")
    public ResponseEntity<ApiResponse<ServiceDto.PublicService>> getPublicServiceById(@PathVariable Long id) {
        try {
            // ✅ Ab naya method use karenge jo PublicService return karega
            ServiceDto.PublicService service = serviceService.getPublicServiceById(id);
            return ResponseEntity.ok(ApiResponse.success("Service retrieved successfully", service));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/public/services/category/{category}")
    public ResponseEntity<ApiResponse<List<ServiceDto.PublicService>>> getServicesByCategory(
            @PathVariable String category) {
        try {
            List<ServiceDto.PublicService> services = serviceService.getServicesByCategory(category);
            return ResponseEntity.ok(ApiResponse.success("Services retrieved successfully", services));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/public/service-categories")
    public ResponseEntity<ApiResponse<List<String>>> getServiceCategories() {
        try {
            List<String> categories = serviceService.getServiceCategories();
            return ResponseEntity.ok(ApiResponse.success("Categories retrieved successfully", categories));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    // 🔍 PUBLIC SEARCH ENDPOINTS
    @GetMapping("/public/services/search/name")
    public ResponseEntity<ApiResponse<List<ServiceDto.PublicService>>> searchServicesByName(
            @RequestParam String name) {
        try {
            List<ServiceDto.PublicService> services = serviceService.searchServicesByName(name);
            return ResponseEntity.ok(ApiResponse.success("Services found", services));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/public/services/search")
    public ResponseEntity<ApiResponse<List<ServiceDto.PublicService>>> searchServices(
            @RequestParam String keyword) {
        try {
            List<ServiceDto.PublicService> services = serviceService.searchServices(keyword);
            return ResponseEntity.ok(ApiResponse.success("Services found", services));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/public/services/price-range")
    public ResponseEntity<ApiResponse<List<ServiceDto.PublicService>>> getServicesByPriceRange(
            @RequestParam Double minPrice,
            @RequestParam Double maxPrice) {
        try {
            List<ServiceDto.PublicService> services = serviceService.getServicesByPriceRange(minPrice, maxPrice);
            return ResponseEntity.ok(ApiResponse.success("Services found", services));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }


}