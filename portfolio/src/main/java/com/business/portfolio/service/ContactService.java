package com.business.portfolio.service;

import com.business.portfolio.dto.ContactDto;
import com.business.portfolio.model.Contact;
import com.business.portfolio.model.User;
import com.business.portfolio.repository.ContactRepository;
import com.business.portfolio.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ContactService {

    private final ContactRepository contactRepository;
    private final UserRepository userRepository;

    public ContactDto.ContactResponse createContact(ContactDto.ContactRequest request) {
        Contact contact = new Contact();
        contact.setName(request.getName());
        contact.setEmail(request.getEmail());
        contact.setPhone(request.getPhone());
        contact.setSubject(request.getSubject());
        contact.setMessage(request.getMessage());
        contact.setStatus(Contact.ContactStatus.NEW); // Explicitly set status

        // If user exists with this email, link the contact
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

    // Admin method to get all contacts as entities
    public List<Contact> getAllContactEntities() {
        return contactRepository.findAll();
    }

    // Admin method to get all contacts with proper ordering
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