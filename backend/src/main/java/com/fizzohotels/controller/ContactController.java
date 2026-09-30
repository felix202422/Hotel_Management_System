package com.fizzohotels.controller;

import com.fizzohotels.dto.ApiResponse;
import com.fizzohotels.entity.ContactMessage;
import com.fizzohotels.repository.ContactMessageRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Public contact endpoint for the visitor site, plus admin-only inbox listing.
 */
@RestController
public class ContactController {

    public static class ContactRequest {
        @NotBlank private String name;
        @NotBlank @Email private String email;
        private String subject;
        @NotBlank private String message;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getSubject() { return subject; }
        public void setSubject(String subject) { this.subject = subject; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }

    private final ContactMessageRepository contactMessageRepository;

    public ContactController(ContactMessageRepository contactMessageRepository) {
        this.contactMessageRepository = contactMessageRepository;
    }

    @PostMapping("/api/contact")
    public ResponseEntity<ApiResponse<ContactMessage>> submit(@Valid @RequestBody ContactRequest request) {
        ContactMessage msg = new ContactMessage();
        msg.setName(request.getName().trim());
        msg.setEmail(request.getEmail().trim());
        msg.setSubject(request.getSubject() != null ? request.getSubject().trim() : "");
        msg.setMessage(request.getMessage().trim());
        ContactMessage saved = contactMessageRepository.save(msg);
        return ResponseEntity.ok(ApiResponse.success("Message received. We will get back to you soon.", saved));
    }

    @GetMapping("/api/contact")
    public ResponseEntity<ApiResponse<Page<ContactMessage>>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<ContactMessage> messages = contactMessageRepository
                .findAll(PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt")));
        return ResponseEntity.ok(ApiResponse.success("Contact messages retrieved", messages));
    }
}
