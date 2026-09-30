package com.fizzohotels.controller;

import com.fizzohotels.dto.ApiResponse;
import com.fizzohotels.entity.Room;
import com.fizzohotels.service.RoomService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<Room>>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "roomId") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(roomService.getAll(page, size, sortBy, sortDir, search));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Room>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(roomService.getById(id));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Room>> create(@RequestBody Room room) {
        return ResponseEntity.ok(roomService.create(room));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Room>> update(@PathVariable Long id, @RequestBody Room room) {
        return ResponseEntity.ok(roomService.update(id, room));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        return ResponseEntity.ok(roomService.delete(id));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<?> getByStatus(@PathVariable String status) {
        return ResponseEntity.ok(roomService.getByStatus(status));
    }
}
