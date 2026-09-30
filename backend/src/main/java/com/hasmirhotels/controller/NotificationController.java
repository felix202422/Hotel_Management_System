package com.hasmirhotels.controller;

import com.hasmirhotels.dto.ApiResponse;
import com.hasmirhotels.entity.Notification;
import com.hasmirhotels.repository.NotificationRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationRepository repository;

    public NotificationController(NotificationRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Notification>>> getAll(
            @RequestParam(required = false) Long userId) {
        List<Notification> notifications;
        if (userId != null) {
            notifications = repository.findByUserIdOrderByCreatedAtDesc(userId);
        } else {
            notifications = repository.findAll();
        }
        return ResponseEntity.ok(ApiResponse.success("Notifications retrieved", notifications));
    }

    @GetMapping("/unread-count/{userId}")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getUnreadCount(@PathVariable Long userId) {
        long count = repository.countByUserIdAndIsReadFalse(userId);
        return ResponseEntity.ok(ApiResponse.success("Unread count", Map.of("count", count)));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Notification>> markAsRead(@PathVariable Long id) {
        Notification notification = repository.findById(id).orElse(null);
        if (notification == null) {
            return ResponseEntity.ok(ApiResponse.error("Notification not found"));
        }
        notification.setRead(true);
        Notification saved = repository.save(notification);
        return ResponseEntity.ok(ApiResponse.success("Notification marked as read", saved));
    }

    @PutMapping("/read-all/{userId}")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead(@PathVariable Long userId) {
        List<Notification> notifications = repository.findByUserIdOrderByCreatedAtDesc(userId);
        for (Notification n : notifications) {
            if (!n.isRead()) {
                n.setRead(true);
                repository.save(n);
            }
        }
        return ResponseEntity.ok(ApiResponse.success("All notifications marked as read", null));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.ok(ApiResponse.error("Notification not found"));
        }
        repository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("Notification deleted", null));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Notification>> create(@RequestBody Notification notification) {
        if (notification.getCreatedAt() == null) {
            notification.setCreatedAt(LocalDateTime.now());
        }
        if (!notification.isRead()) {
            notification.setRead(false);
        }
        Notification saved = repository.save(notification);
        return ResponseEntity.ok(ApiResponse.success("Notification created", saved));
    }
}
