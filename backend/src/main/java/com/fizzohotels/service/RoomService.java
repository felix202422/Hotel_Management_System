package com.fizzohotels.service;

import com.fizzohotels.dto.ApiResponse;
import com.fizzohotels.entity.Room;
import com.fizzohotels.repository.RoomRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class RoomService extends HotelService<Room> {

    private final RoomRepository roomRepository;

    public RoomService(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    @Override
    public ApiResponse<Room> create(Room room) {
        if (room.getRoomNumber() == null || room.getRoomNumber().isBlank()) {
            return ApiResponse.error("Room number is required");
        }
        if (roomRepository.existsByRoomNumberIgnoreCase(room.getRoomNumber().trim())) {
            return ApiResponse.error("Room number already exists");
        }
        Room saved = roomRepository.save(room);
        return ApiResponse.success("Room created successfully", saved);
    }

    @Override
    public ApiResponse<Room> update(Long id, Room room) {
        Room existing = roomRepository.findById(id).orElse(null);
        if (existing == null) {
            return ApiResponse.error("Room not found");
        }
        if (room.getRoomNumber() == null || room.getRoomNumber().isBlank()) {
            return ApiResponse.error("Room number is required");
        }
        Room duplicate = roomRepository.findByRoomNumberIgnoreCase(room.getRoomNumber().trim()).orElse(null);
        if (duplicate != null && !duplicate.getRoomId().equals(id)) {
            return ApiResponse.error("Room number already exists");
        }
        existing.setRoomNumber(room.getRoomNumber().trim());
        existing.setRoomType(room.getRoomType());
        existing.setFloor(room.getFloor());
        existing.setCapacity(room.getCapacity());
        existing.setPricePerNight(room.getPricePerNight());
        existing.setRoomStatus(room.getRoomStatus());
        Room saved = roomRepository.save(existing);
        return ApiResponse.success("Room updated successfully", saved);
    }

    @Override
    public ApiResponse<Void> delete(Long id) {
        if (!roomRepository.existsById(id)) {
            return ApiResponse.error("Room not found");
        }
        roomRepository.deleteById(id);
        return ApiResponse.success("Room deleted successfully", null);
    }

    @Override
    public ApiResponse<Room> getById(Long id) {
        Room room = roomRepository.findById(id).orElse(null);
        if (room == null) {
            return ApiResponse.error("Room not found");
        }
        return ApiResponse.success("Room found", room);
    }

    @Override
    public ApiResponse<Page<Room>> getAll(int page, int size, String sortBy, String sortDir, String search) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Room> rooms;
        if (search != null && !search.isEmpty()) {
            rooms = roomRepository.findByRoomNumberContainingIgnoreCase(search, pageable);
        } else {
            rooms = roomRepository.findAll(pageable);
        }
        return ApiResponse.success("Rooms retrieved", rooms);
    }

    public ApiResponse<List<Room>> getByStatus(String status) {
        return ApiResponse.success("Rooms by status", roomRepository.findByRoomStatus(status));
    }

    public ApiResponse<List<Room>> getByType(String type) {
        return ApiResponse.success("Rooms by type", roomRepository.findByRoomType(type));
    }

    public long countByStatus(String status) {
        return roomRepository.countByRoomStatus(status);
    }
}
