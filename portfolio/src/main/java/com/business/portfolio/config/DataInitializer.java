package com.business.portfolio.config;

import com.business.portfolio.model.*;
import com.business.portfolio.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final ServiceRepository serviceRepository;
    private final ContactRepository contactRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Only initialize if database is empty
        if (userRepository.count() == 0) {
            initializeData();
        }
        // Always ensure we have sample contacts
        if (contactRepository.count() == 0) {
            createSampleContacts();
        }
    }

    private void initializeData() {
        // Create admin user
        User admin = new User();
        admin.setName("Yash Bhandva");
        admin.setEmail("admin@gmail.com");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setRole(User.Role.ADMIN);
        admin.setPhoneNumber("+1234567890");
        admin.setCompany("Portfolio Company");
        userRepository.save(admin);

        // Create sample client
        User client = new User();
        client.setName("John Doe");
        client.setEmail("user@gmail.com");
        client.setPassword(passwordEncoder.encode("user123"));
        client.setRole(User.Role.CLIENT);
        client.setPhoneNumber("+1987654321");
        userRepository.save(client);

        // Create sample services
        Service service1 = new Service();
        service1.setName("Web Development");
        service1.setDescription("Custom web application development");
        service1.setCategory("WEB_DEV");
        service1.setStartingPrice(new java.math.BigDecimal("2500.00"));
        service1.setDeliveryDays(30);
        service1.setFeatures("Responsive Design, SEO Optimized, Mobile Friendly");
        service1.setActive(true);
        serviceRepository.save(service1);

        Service service2 = new Service();
        service2.setName("Mobile App Development");
        service2.setDescription("Native and cross-platform mobile apps");
        service2.setCategory("MOBILE_APP");
        service2.setStartingPrice(new java.math.BigDecimal("3500.00"));
        service2.setDeliveryDays(45);
        service2.setFeatures("Cross-platform, Push Notifications, Offline Support");
        service2.setActive(true);
        serviceRepository.save(service2);

        // Create sample contacts
        Contact contact1 = new Contact();
        contact1.setName("Jane Smith");
        contact1.setEmail("jane@example.com");
        contact1.setSubject("Project Inquiry");
        contact1.setMessage("I'm interested in web development services for my startup");
        contact1.setStatus(Contact.ContactStatus.NEW);
        contactRepository.save(contact1);

        Contact contact2 = new Contact();
        contact2.setName("Mike Johnson");
        contact2.setEmail("mike@company.com");
        contact2.setSubject("Mobile App Development");
        contact2.setMessage("We need a mobile app for our business. Can you help?");
        contact2.setStatus(Contact.ContactStatus.NEW);
        contactRepository.save(contact2);

        Contact contact3 = new Contact();
        contact3.setName("Sarah Wilson");
        contact3.setEmail("sarah@email.com");
        contact3.setSubject("Website Redesign");
        contact3.setMessage("Looking to redesign our existing website with modern features");
        contact3.setStatus(Contact.ContactStatus.NEW);
        contactRepository.save(contact3);

        System.out.println("Sample data initialized successfully!");
    }

    private void createSampleContacts() {
        // Create sample contacts
        Contact contact1 = new Contact();
        contact1.setName("Jane Smith");
        contact1.setEmail("jane@example.com");
        contact1.setSubject("Project Inquiry");
        contact1.setMessage("I'm interested in web development services for my startup");
        contact1.setStatus(Contact.ContactStatus.NEW);
        contactRepository.save(contact1);

        Contact contact2 = new Contact();
        contact2.setName("Mike Johnson");
        contact2.setEmail("mike@company.com");
        contact2.setSubject("Mobile App Development");
        contact2.setMessage("We need a mobile app for our business. Can you help?");
        contact2.setStatus(Contact.ContactStatus.NEW);
        contactRepository.save(contact2);

        Contact contact3 = new Contact();
        contact3.setName("Sarah Wilson");
        contact3.setEmail("sarah@email.com");
        contact3.setSubject("Website Redesign");
        contact3.setMessage("Looking to redesign our existing website with modern features");
        contact3.setStatus(Contact.ContactStatus.NEW);
        contactRepository.save(contact3);

        System.out.println("Sample contacts created successfully!");
    }
}