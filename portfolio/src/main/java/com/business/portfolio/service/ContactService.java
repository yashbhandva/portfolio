package com.business.portfolio.service;

import com.business.portfolio.dto.ContactDto;
import com.business.portfolio.model.Contact;
import com.business.portfolio.model.User;
import com.business.portfolio.repository.ContactRepository;
import com.business.portfolio.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ContactService {

    private final ContactRepository contactRepository;
    private final UserRepository userRepository;
    private final JavaMailSender emailSender;

    public ContactDto.ContactResponse createContact(ContactDto.ContactRequest request) {
        Contact contact = new Contact();
        contact.setName(request.getName());
        contact.setEmail(request.getEmail());
        contact.setPhone(request.getPhone());
        contact.setSubject(request.getSubject());
        contact.setMessage(request.getMessage());
        contact.setStatus(Contact.ContactStatus.NEW);

        userRepository.findByEmail(request.getEmail()).ifPresent(contact::setUser);

        Contact savedContact = contactRepository.save(contact);
        return convertToResponse(savedContact);
    }

    public List<ContactDto.ContactResponse> getAllContacts() {
        return contactRepository.findAllOrderByCreatedAtDesc()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<Contact> getAllContactEntities() {
        return contactRepository.findAll();
    }

    public List<ContactDto.ContactResponse> getAllContactsForAdmin() {
        return contactRepository.findAllOrderByCreatedAtDesc()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<ContactDto.ContactResponse> getContactsByStatus(Contact.ContactStatus status) {
        return contactRepository.findByStatus(status)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public ContactDto.ContactResponse updateContactStatus(Long contactId, ContactDto.UpdateContactStatus request) {
        Contact contact = contactRepository.findById(contactId)
                .orElseThrow(() -> new RuntimeException("Contact not found"));

        contact.setStatus(request.getStatus());
        Contact updatedContact = contactRepository.save(contact);
        return convertToResponse(updatedContact);
    }

    public void replyToContact(Long contactId, String replyMessage) {
        Contact contact = contactRepository.findById(contactId)
                .orElseThrow(() -> new RuntimeException("Contact not found"));

        // Send Email
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(contact.getEmail());
            message.setSubject("Re: " + contact.getSubject());
            message.setText(replyMessage);
            emailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
            // Continue to update status even if email fails (for demo purposes)
        }

        // Update status to RESOLVED
        contact.setStatus(Contact.ContactStatus.RESOLVED);
        contactRepository.save(contact);
    }

    public List<ContactDto.ContactResponse> getUserContacts(Long userId) {
        return contactRepository.findByUserId(userId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public long getContactsCountByStatus(Contact.ContactStatus status) {
        return contactRepository.countByStatus(status);
    }

    private ContactDto.ContactResponse convertToResponse(Contact contact) {
        ContactDto.ContactResponse response = new ContactDto.ContactResponse();
        response.setId(contact.getId());
        response.setName(contact.getName());
        response.setEmail(contact.getEmail());
        response.setPhone(contact.getPhone());
        response.setSubject(contact.getSubject());
        response.setMessage(contact.getMessage());
        response.setStatus(contact.getStatus());
        response.setCreatedAt(contact.getCreatedAt());

        if (contact.getUser() != null) {
            response.setUserId(contact.getUser().getId());
            response.setUserName(contact.getUser().getName());
        }

        return response;
    }
}