package com.hasmirhotels.service;

import com.hasmirhotels.dto.ApiResponse;
import com.hasmirhotels.entity.Reservation;
import com.hasmirhotels.entity.Room;
import com.hasmirhotels.repository.ReservationRepository;
import com.hasmirhotels.repository.RoomRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class ReservationService extends HotelService<Reservation> {

    private final ReservationRepository reservationRepository;
    private final RoomRepository roomRepository;

    public ReservationService(ReservationRepository reservationRepository, RoomRepository roomRepository) {
        this.reservationRepository = reservationRepository;
        this.roomRepository = roomRepository;
    }

    @Override
    public ApiResponse<Reservation> create(Reservation reservation) {
        if (reservation.getCheckInDate() == null || reservation.getCheckOutDate() == null) {
            return ApiResponse.error("Check-in and check-out dates are required");
        }
        if (!reservation.getCheckOutDate().isAfter(reservation.getCheckInDate())) {
            return ApiResponse.error("Check-out date must be after check-in date");
        }
        Room room = roomRepository.findById(reservation.getRoom().getRoomId()).orElse(null);
        if (room == null) {
            return ApiResponse.error("Room not found");
        }
        if (!room.getRoomStatus().equals("Available")) {
            return ApiResponse.error("Room is not available");
        }
        long overlaps = reservationRepository.countOverlappingReservations(
                room.getRoomId(), reservation.getCheckInDate(), reservation.getCheckOutDate(), null);
        if (overlaps > 0) {
            return ApiResponse.error("Room is already reserved between " + reservation.getCheckInDate()
                    + " and " + reservation.getCheckOutDate());
        }
        reservation.setTotalPrice(calculateTotalPrice(room.getPricePerNight().doubleValue(), reservation.getCheckInDate(), reservation.getCheckOutDate()));
        Reservation saved = reservationRepository.save(reservation);
        room.setRoomStatus("Reserved");
        roomRepository.save(room);
        return ApiResponse.success("Reservation created successfully", saved);
    }

    @Override
    public ApiResponse<Reservation> update(Long id, Reservation reservation) {
        Reservation existing = reservationRepository.findById(id).orElse(null);
        if (existing == null) {
            return ApiResponse.error("Reservation not found");
        }
        Room targetRoom = reservation.getRoom() != null
                ? roomRepository.findById(reservation.getRoom().getRoomId()).orElse(existing.getRoom())
                : existing.getRoom();
        LocalDate checkIn = reservation.getCheckInDate() != null ? reservation.getCheckInDate() : existing.getCheckInDate();
        LocalDate checkOut = reservation.getCheckOutDate() != null ? reservation.getCheckOutDate() : existing.getCheckOutDate();
        if (!checkOut.isAfter(checkIn)) {
            return ApiResponse.error("Check-out date must be after check-in date");
        }
        if (targetRoom == null) {
            return ApiResponse.error("Room not found");
        }
        long overlaps = reservationRepository.countOverlappingReservations(
                targetRoom.getRoomId(), checkIn, checkOut, id);
        if (overlaps > 0) {
            return ApiResponse.error("Room is already reserved between " + checkIn + " and " + checkOut);
        }
        existing.setGuest(reservation.getGuest() != null ? reservation.getGuest() : existing.getGuest());
        existing.setRoom(targetRoom);
        existing.setCheckInDate(checkIn);
        existing.setCheckOutDate(checkOut);
        existing.setReservationStatus(reservation.getReservationStatus() != null
                ? reservation.getReservationStatus() : existing.getReservationStatus());
        existing.setTotalPrice(calculateTotalPrice(targetRoom.getPricePerNight().doubleValue(), checkIn, checkOut));
        Reservation saved = reservationRepository.save(existing);
        return ApiResponse.success("Reservation updated successfully", saved);
    }

    @Override
    public ApiResponse<Void> delete(Long id) {
        Reservation reservation = reservationRepository.findById(id).orElse(null);
        if (reservation == null) {
            return ApiResponse.error("Reservation not found");
        }
        Room room = reservation.getRoom();
        room.setRoomStatus("Available");
        roomRepository.save(room);
        reservationRepository.deleteById(id);
        return ApiResponse.success("Reservation deleted successfully", null);
    }

    @Override
    public ApiResponse<Reservation> getById(Long id) {
        Reservation reservation = reservationRepository.findById(id).orElse(null);
        if (reservation == null) {
            return ApiResponse.error("Reservation not found");
        }
        return ApiResponse.success("Reservation found", reservation);
    }

    @Override
    public ApiResponse<Page<Reservation>> getAll(int page, int size, String sortBy, String sortDir, String search) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Reservation> reservations = reservationRepository.findAll(pageable);
        return ApiResponse.success("Reservations retrieved", reservations);
    }

    public ApiResponse<List<Reservation>> getByStatus(String status) {
        return ApiResponse.success("Reservations by status", reservationRepository.findByReservationStatus(status));
    }

    public ApiResponse<List<Reservation>> getTodaysCheckIns() {
        return ApiResponse.success("Today's check-ins", reservationRepository.findByCheckInDate(LocalDate.now()));
    }

    public ApiResponse<List<Reservation>> getTodaysCheckOuts() {
        return ApiResponse.success("Today's check-outs", reservationRepository.findByCheckOutDate(LocalDate.now()));
    }

    private double calculateTotalPrice(double pricePerNight, LocalDate checkIn, LocalDate checkOut) {
        long nights = checkIn.until(checkOut).getDays();
        return pricePerNight * Math.max(nights, 1);
    }
}
