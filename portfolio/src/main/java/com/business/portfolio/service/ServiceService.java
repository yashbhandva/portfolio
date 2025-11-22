package com.business.portfolio.service;

import com.business.portfolio.dto.ServiceDto;
import com.business.portfolio.model.Service;
import com.business.portfolio.repository.ServiceRepository;
import lombok.RequiredArgsConstructor;
import java.util.List;
import java.util.stream.Collectors;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class ServiceService {

    private final ServiceRepository serviceRepository;

    // ✅ ADMIN KE LIYE - ServiceResponse return karega
    public List<ServiceDto.ServiceResponse> getAllServices() {
        return serviceRepository.findActiveServicesOrdered()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // Admin method to get all services as entities
    public List<Service> getAllServiceEntities() {
        return serviceRepository.findAll();
    }

    // Admin method to save service entity
    public Service saveService(Service service) {
        return serviceRepository.save(service);
    }

    // ✅ PUBLIC KE LIYE - PublicService return karega
    public List<ServiceDto.PublicService> getActiveServices() {
        return serviceRepository.findByActiveTrueOrderByDisplayOrderAsc()
                .stream()
                .map(this::convertToPublicService)
                .collect(Collectors.toList());
    }

    // ✅ ADMIN KE LIYE - ServiceResponse return karega
    public ServiceDto.ServiceResponse getServiceById(Long id) {
        Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found"));
        return convertToResponse(service);
    }

    // ✅ PUBLIC KE LIYE - PublicService return karega (Naya method add kiya)
    public ServiceDto.PublicService getPublicServiceById(Long id) {
        Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found"));
        return convertToPublicService(service);
    }

    public ServiceDto.ServiceResponse createService(ServiceDto.ServiceRequest request) {
        Service service = new Service();
        service.setName(request.getName());
        service.setCategory(request.getCategory());
        service.setDescription(request.getDescription());
        service.setStartingPrice(request.getStartingPrice());
        service.setDeliveryDays(request.getDeliveryDays());
        service.setFeatures(request.getFeatures());
        service.setActive(request.isActive());
        service.setDisplayOrder(request.getDisplayOrder());

        Service savedService = serviceRepository.save(service);
        return convertToResponse(savedService);
    }

    public ServiceDto.ServiceResponse updateService(Long id, ServiceDto.ServiceRequest request) {
        Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found"));

        if (request.getName() != null) service.setName(request.getName());
        if (request.getCategory() != null) service.setCategory(request.getCategory());
        if (request.getDescription() != null) service.setDescription(request.getDescription());
        if (request.getStartingPrice() != null) service.setStartingPrice(request.getStartingPrice());
        if (request.getDeliveryDays() != null) service.setDeliveryDays(request.getDeliveryDays());
        if (request.getFeatures() != null) service.setFeatures(request.getFeatures());

        service.setActive(request.isActive());
        service.setDisplayOrder(request.getDisplayOrder());

        Service updatedService = serviceRepository.save(service);
        return convertToResponse(updatedService);
    }

    public void deleteService(Long id) {
        Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found"));
        serviceRepository.delete(service);
    }

    // 🔍 SEARCH METHODS - PublicService return karenge
    public List<ServiceDto.PublicService> searchServicesByName(String name) {
        return serviceRepository.findByNameContainingIgnoreCase(name)
                .stream()
                .map(this::convertToPublicService)
                .collect(Collectors.toList());
    }

    public List<ServiceDto.PublicService> searchActiveServicesByName(String name) {
        return serviceRepository.findActiveByNameContainingIgnoreCase(name)
                .stream()
                .map(this::convertToPublicService)
                .collect(Collectors.toList());
    }

    public List<ServiceDto.PublicService> searchServices(String keyword) {
        return serviceRepository.findByNameOrDescriptionContainingIgnoreCase(keyword)
                .stream()
                .map(this::convertToPublicService)
                .collect(Collectors.toList());
    }

    public List<ServiceDto.PublicService> getServicesByCategory(String category) {
        return serviceRepository.findByCategory(category)
                .stream()
                .map(this::convertToPublicService)
                .collect(Collectors.toList());
    }

    public List<ServiceDto.PublicService> getServicesByPriceRange(Double minPrice, Double maxPrice) {
        return serviceRepository.findByPriceRange(minPrice, maxPrice)
                .stream()
                .map(this::convertToPublicService)
                .collect(Collectors.toList());
    }

    public List<String> getServiceCategories() {
        return serviceRepository.findDistinctActiveCategories();
    }

    public long getActiveServicesCount() {
        return serviceRepository.countByActiveTrue();
    }

    // ✅ ADMIN RESPONSE CONVERTER
    private ServiceDto.ServiceResponse convertToResponse(Service service) {
        ServiceDto.ServiceResponse response = new ServiceDto.ServiceResponse();
        response.setId(service.getId());
        response.setName(service.getName());
        response.setCategory(service.getCategory());
        response.setDescription(service.getDescription());
        response.setStartingPrice(service.getStartingPrice());
        response.setDeliveryDays(service.getDeliveryDays());
        response.setFeatures(service.getFeatures());
        response.setActive(service.isActive());
        response.setDisplayOrder(service.getDisplayOrder());
        return response;
    }

    // ✅ PUBLIC RESPONSE CONVERTER
    private ServiceDto.PublicService convertToPublicService(Service service) {
        ServiceDto.PublicService publicService = new ServiceDto.PublicService();
        publicService.setId(service.getId());
        publicService.setName(service.getName());
        publicService.setCategory(service.getCategory());
        publicService.setDescription(service.getDescription());
        publicService.setStartingPrice(service.getStartingPrice());
        publicService.setDeliveryDays(service.getDeliveryDays());
        publicService.setFeatures(service.getFeatures());
        return publicService;
    }
}