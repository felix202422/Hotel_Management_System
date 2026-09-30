package com.fizzohotels.controller;

import com.fizzohotels.dto.ApiResponse;
import com.fizzohotels.entity.Guest;
import com.fizzohotels.service.GuestService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/guests")
public class GuestController {

    private final GuestService guestService;

    public GuestController(GuestService guestService) {
        this.guestService = guestService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<Guest>>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "guestId") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(guestService.getAll(page, size, sortBy, sortDir, search));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Guest>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(guestService.getById(id));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Guest>> create(@RequestBody Guest guest) {
        return ResponseEntity.ok(guestService.create(guest));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Guest>> update(@PathVariable Long id, @RequestBody Guest guest) {
        return ResponseEntity.ok(guestService.update(id, guest));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        return ResponseEntity.ok(guestService.delete(id));
    }
}
