package com.fizzohotels.controller;

import com.fizzohotels.dto.ApiResponse;
import com.fizzohotels.entity.MaintenanceRequest;
import com.fizzohotels.repository.MaintenanceRequestRepository;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/maintenance")
public class MaintenanceController {

    private final MaintenanceRequestRepository repository;

    public MaintenanceController(MaintenanceRequestRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<MaintenanceRequest>>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "maintenanceId") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) String search) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<MaintenanceRequest> result;
        if (search != null && !search.isEmpty()) {
            result = repository.findByDescriptionContainingIgnoreCase(search, pageable);
        } else {
            result = repository.findAll(pageable);
        }
        return ResponseEntity.ok(ApiResponse.success("Maintenance requests retrieved", result));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MaintenanceRequest>> getById(@PathVariable Long id) {
        MaintenanceRequest request = repository.findById(id).orElse(null);
        if (request == null) {
            return ResponseEntity.ok(ApiResponse.error("Maintenance request not found"));
        }
        return ResponseEntity.ok(ApiResponse.success("Maintenance request found", request));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<MaintenanceRequest>> create(@RequestBody MaintenanceRequest request) {
        if (request.getReportedDate() == null) {
            request.setReportedDate(LocalDate.now());
        }
        if (request.getStatus() == null) {
            request.setStatus("PENDING");
        }
        MaintenanceRequest saved = repository.save(request);
        return ResponseEntity.ok(ApiResponse.success("Maintenance request created", saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<MaintenanceRequest>> update(@PathVariable Long id, @RequestBody MaintenanceRequest request) {
        MaintenanceRequest existing = repository.findById(id).orElse(null);
        if (existing == null) {
            return ResponseEntity.ok(ApiResponse.error("Maintenance request not found"));
        }
        if (request.getRoom() != null) existing.setRoom(request.getRoom());
        if (request.getDescription() != null) existing.setDescription(request.getDescription());
        if (request.getPriority() != null) existing.setPriority(request.getPriority());
        if (request.getStatus() != null) existing.setStatus(request.getStatus());
        if (request.getAssignedTo() != null) existing.setAssignedTo(request.getAssignedTo());
        if (request.getCategory() != null) existing.setCategory(request.getCategory());
        if (request.getReportedDate() != null) existing.setReportedDate(request.getReportedDate());
        if (request.getCompletedDate() != null) existing.setCompletedDate(request.getCompletedDate());
        if (request.getNotes() != null) existing.setNotes(request.getNotes());
        MaintenanceRequest saved = repository.save(existing);
        return ResponseEntity.ok(ApiResponse.success("Maintenance request updated", saved));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.ok(ApiResponse.error("Maintenance request not found"));
        }
        repository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("Maintenance request deleted", null));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<MaintenanceRequest>> updateStatus(
            @PathVariable Long id, @RequestBody Map<String, String> body) {
        MaintenanceRequest existing = repository.findById(id).orElse(null);
        if (existing == null) {
            return ResponseEntity.ok(ApiResponse.error("Maintenance request not found"));
        }
        String status = body.get("status");
        if (status == null || status.isEmpty()) {
            return ResponseEntity.ok(ApiResponse.error("Status is required"));
        }
        existing.setStatus(status);
        if ("COMPLETED".equalsIgnoreCase(status)) {
            existing.setCompletedDate(LocalDate.now());
        }
        MaintenanceRequest saved = repository.save(existing);
        return ResponseEntity.ok(ApiResponse.success("Status updated", saved));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<MaintenanceRequest>>> getByStatus(@PathVariable String status) {
        List<MaintenanceRequest> requests = repository.findByStatus(status);
        return ResponseEntity.ok(ApiResponse.success("Maintenance requests by status", requests));
    }
}
