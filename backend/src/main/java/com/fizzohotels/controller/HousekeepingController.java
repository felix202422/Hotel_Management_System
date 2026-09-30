package com.fizzohotels.controller;

import com.fizzohotels.dto.ApiResponse;
import com.fizzohotels.entity.Housekeeping;
import com.fizzohotels.service.HousekeepingService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/housekeeping")
public class HousekeepingController {

    private final HousekeepingService housekeepingService;

    public HousekeepingController(HousekeepingService housekeepingService) {
        this.housekeepingService = housekeepingService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<Housekeeping>>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "housekeepingId") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(housekeepingService.getAll(page, size, sortBy, sortDir, search));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Housekeeping>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(housekeepingService.getById(id));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Housekeeping>> create(@RequestBody Housekeeping housekeeping) {
        return ResponseEntity.ok(housekeepingService.create(housekeeping));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Housekeeping>> update(@PathVariable Long id, @RequestBody Housekeeping housekeeping) {
        return ResponseEntity.ok(housekeepingService.update(id, housekeeping));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        return ResponseEntity.ok(housekeepingService.delete(id));
    }
}
