package com.fizzohotels.controller;

import com.fizzohotels.dto.ApiResponse;
import com.fizzohotels.entity.AuditLog;
import com.fizzohotels.repository.AuditLogRepository;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/audit")
public class AuditLogController {

    private final AuditLogRepository repository;

    public AuditLogController(AuditLogRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<AuditLog>>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<AuditLog> result = repository.findAllByOrderByTimestampDesc(pageable);
        return ResponseEntity.ok(ApiResponse.success("Audit logs retrieved", result));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<AuditLog>>> getByUser(@PathVariable String userId) {
        List<AuditLog> logs = repository.findByUserIdOrderByTimestampDesc(userId);
        return ResponseEntity.ok(ApiResponse.success("Audit logs by user", logs));
    }

    @GetMapping("/action/{action}")
    public ResponseEntity<ApiResponse<List<AuditLog>>> getByAction(@PathVariable String action) {
        List<AuditLog> logs = repository.findByActionOrderByTimestampDesc(action);
        return ResponseEntity.ok(ApiResponse.success("Audit logs by action", logs));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AuditLog>> create(@RequestBody AuditLog auditLog) {
        if (auditLog.getTimestamp() == null) {
            auditLog.setTimestamp(LocalDateTime.now());
        }
        AuditLog saved = repository.save(auditLog);
        return ResponseEntity.ok(ApiResponse.success("Audit log created", saved));
    }
}
