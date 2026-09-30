package com.hasmirhotels.repository;

import com.hasmirhotels.entity.Reservation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    long countByReservationStatus(String status);
    List<Reservation> findByReservationStatus(String status);
    List<Reservation> findByCheckInDate(LocalDate date);
    List<Reservation> findByCheckOutDate(LocalDate date);

    /**
     * Counts active (non-cancelled) reservations for a room whose date range
     * overlaps [checkIn, checkOut), optionally excluding one reservation
     * (the one being updated). Overlap semantics: existing.checkIn < new checkOut
     * AND existing.checkOut > new checkIn (checkout day is bookable by the next guest).
     */
    @Query("SELECT COUNT(r) FROM Reservation r " +
           "WHERE r.room.roomId = :roomId " +
           "AND r.reservationStatus <> 'Cancelled' " +
           "AND r.checkInDate < :checkOut " +
           "AND r.checkOutDate > :checkIn " +
           "AND (:excludeId IS NULL OR r.reservationId <> :excludeId)")
    long countOverlappingReservations(@Param("roomId") Long roomId,
                                      @Param("checkIn") LocalDate checkIn,
                                      @Param("checkOut") LocalDate checkOut,
                                      @Param("excludeId") Long excludeId);

    @Query("SELECT MONTH(r.checkInDate), SUM(r.totalPrice) FROM Reservation r WHERE r.reservationStatus != 'Cancelled' GROUP BY MONTH(r.checkInDate) ORDER BY MONTH(r.checkInDate)")
    List<Object[]> getMonthlyRevenue();
}
