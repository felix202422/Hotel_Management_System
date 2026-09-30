package com.hasmirhotels.controller;

import com.hasmirhotels.dto.ApiResponse;
import com.hasmirhotels.entity.Reservation;
import com.hasmirhotels.entity.Room;
import com.hasmirhotels.repository.ReservationRepository;
import com.hasmirhotels.repository.RoomRepository;
import com.hasmirhotels.service.ReservationService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    private final ReservationService reservationService;
    private final ReservationRepository reservationRepository;
    private final RoomRepository roomRepository;

    public ReservationController(ReservationService reservationService,
                                 ReservationRepository reservationRepository,
                                 RoomRepository roomRepository) {
        this.reservationService = reservationService;
        this.reservationRepository = reservationRepository;
        this.roomRepository = roomRepository;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<Reservation>>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "reservationId") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(reservationService.getAll(page, size, sortBy, sortDir, search));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Reservation>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(reservationService.getById(id));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Reservation>> create(@RequestBody Reservation reservation) {
        return ResponseEntity.ok(reservationService.create(reservation));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Reservation>> update(@PathVariable Long id, @RequestBody Reservation reservation) {
        return ResponseEntity.ok(reservationService.update(id, reservation));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        return ResponseEntity.ok(reservationService.delete(id));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<?> getByStatus(@PathVariable String status) {
        return ResponseEntity.ok(reservationService.getByStatus(status));
    }

    @GetMapping("/checkins/today")
    public ResponseEntity<?> getTodaysCheckIns() {
        return ResponseEntity.ok(reservationService.getTodaysCheckIns());
    }

    @GetMapping("/checkouts/today")
    public ResponseEntity<?> getTodaysCheckOuts() {
        return ResponseEntity.ok(reservationService.getTodaysCheckOuts());
    }

    @PutMapping("/{id}/checkin")
    public ResponseEntity<ApiResponse<Reservation>> checkIn(@PathVariable Long id) {
        Reservation reservation = reservationRepository.findById(id).orElse(null);
        if (reservation == null) {
            return ResponseEntity.ok(ApiResponse.error("Reservation not found"));
        }
        if ("Checked-In".equals(reservation.getReservationStatus())) {
            return ResponseEntity.ok(ApiResponse.error("Guest is already checked in"));
        }
        reservation.setReservationStatus("Checked-In");
        reservationRepository.save(reservation);

        Room room = reservation.getRoom();
        room.setRoomStatus("Occupied");
        roomRepository.save(room);

        return ResponseEntity.ok(ApiResponse.success("Guest checked in successfully", reservation));
    }

    @PutMapping("/{id}/checkout")
    public ResponseEntity<ApiResponse<Reservation>> checkOut(@PathVariable Long id) {
        Reservation reservation = reservationRepository.findById(id).orElse(null);
        if (reservation == null) {
            return ResponseEntity.ok(ApiResponse.error("Reservation not found"));
        }
        if ("Checked-Out".equals(reservation.getReservationStatus())) {
            return ResponseEntity.ok(ApiResponse.error("Guest is already checked out"));
        }
        reservation.setReservationStatus("Checked-Out");
        reservationRepository.save(reservation);

        Room room = reservation.getRoom();
        room.setRoomStatus("Available");
        roomRepository.save(room);

        return ResponseEntity.ok(ApiResponse.success("Guest checked out successfully", reservation));
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<ApiResponse<Reservation>> approve(@PathVariable Long id) {
        Reservation reservation = reservationRepository.findById(id).orElse(null);
        if (reservation == null) {
            return ResponseEntity.ok(ApiResponse.error("Reservation not found"));
        }
        reservation.setReservationStatus("Confirmed");
        reservationRepository.save(reservation);
        return ResponseEntity.ok(ApiResponse.success("Reservation approved", reservation));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<Reservation>> cancel(@PathVariable Long id) {
        Reservation reservation = reservationRepository.findById(id).orElse(null);
        if (reservation == null) {
            return ResponseEntity.ok(ApiResponse.error("Reservation not found"));
        }
        if ("Checked-Out".equals(reservation.getReservationStatus()) || "Cancelled".equals(reservation.getReservationStatus())) {
            return ResponseEntity.ok(ApiResponse.error("Reservation cannot be cancelled"));
        }
        reservation.setReservationStatus("Cancelled");
        reservationRepository.save(reservation);

        Room room = reservation.getRoom();
        room.setRoomStatus("Available");
        roomRepository.save(room);

        return ResponseEntity.ok(ApiResponse.success("Reservation cancelled", reservation));
    }
}
