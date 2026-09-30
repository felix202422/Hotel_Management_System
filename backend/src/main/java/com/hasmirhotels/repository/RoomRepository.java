package com.hasmirhotels.repository;

import com.hasmirhotels.entity.Room;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RoomRepository extends JpaRepository<Room, Long> {
    Page<Room> findByRoomNumberContainingIgnoreCase(String roomNumber, Pageable pageable);
    Page<Room> findByRoomStatus(String status, Pageable pageable);
    Page<Room> findByRoomType(String type, Pageable pageable);
    long countByRoomStatus(String status);
    List<Room> findByRoomStatusIgnoreCase(String status);
    List<Room> findByRoomStatus(String status);
    List<Room> findByRoomType(String type);
    boolean existsByRoomNumberIgnoreCase(String roomNumber);
    java.util.Optional<Room> findByRoomNumberIgnoreCase(String roomNumber);
}
