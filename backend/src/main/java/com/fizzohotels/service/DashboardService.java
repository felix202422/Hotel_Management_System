package com.fizzohotels.service;

import com.fizzohotels.dto.DashboardStats;
import com.fizzohotels.entity.Reservation;
import com.fizzohotels.repository.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.Month;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final RoomRepository roomRepository;
    private final ReservationRepository reservationRepository;
    private final PaymentRepository paymentRepository;
    private final GuestRepository guestRepository;
    private final GuestUserRepository guestUserRepository;
    private final AdminRepository adminRepository;
    private final MaintenanceRequestRepository maintenanceRequestRepository;
    private final InvoiceRepository invoiceRepository;
    private final HousekeepingRepository housekeepingRepository;

    public DashboardService(RoomRepository roomRepository,
                            ReservationRepository reservationRepository,
                            PaymentRepository paymentRepository,
                            GuestRepository guestRepository,
                            GuestUserRepository guestUserRepository,
                            AdminRepository adminRepository,
                            MaintenanceRequestRepository maintenanceRequestRepository,
                            InvoiceRepository invoiceRepository,
                            HousekeepingRepository housekeepingRepository) {
        this.roomRepository = roomRepository;
        this.reservationRepository = reservationRepository;
        this.paymentRepository = paymentRepository;
        this.guestRepository = guestRepository;
        this.guestUserRepository = guestUserRepository;
        this.adminRepository = adminRepository;
        this.maintenanceRequestRepository = maintenanceRequestRepository;
        this.invoiceRepository = invoiceRepository;
        this.housekeepingRepository = housekeepingRepository;
    }

    public DashboardStats getDashboardStats() {
        DashboardStats stats = new DashboardStats();
        LocalDate today = LocalDate.now();

        // Room stats
        long totalRooms = roomRepository.count();
        long availableRooms = roomRepository.countByRoomStatus("Available");
        long occupiedRooms = roomRepository.countByRoomStatus("Occupied");
        long reservedRooms = roomRepository.countByRoomStatus("Reserved");
        long maintenanceRooms = roomRepository.countByRoomStatus("Maintenance");

        stats.setTotalRooms(totalRooms);
        stats.setAvailableRooms(availableRooms);
        stats.setOccupiedRooms(occupiedRooms);
        stats.setReservedRooms(reservedRooms);
        stats.setMaintenanceRooms(maintenanceRooms);

        // Occupancy rate
        double occupancyRate = totalRooms > 0 ? (double) occupiedRooms / totalRooms * 100 : 0;
        stats.setOccupancyRate(Math.round(occupancyRate * 10.0) / 10.0);

        // Today check-ins / check-outs
        List<Reservation> todayCheckInList = reservationRepository.findByCheckInDate(today);
        List<Reservation> todayCheckOutList = reservationRepository.findByCheckOutDate(today);
        stats.setTodayCheckins(todayCheckInList.size());
        stats.setTodayCheckouts(todayCheckOutList.size());

        // Active reservations
        long activeReservations = reservationRepository.countByReservationStatus("Checked-In")
                + reservationRepository.countByReservationStatus("Reserved");
        stats.setActiveReservations(activeReservations);

        // Revenue
        Double totalRevenueDouble = paymentRepository.getTotalRevenue();
        BigDecimal totalRevenue = BigDecimal.valueOf(totalRevenueDouble != null ? totalRevenueDouble : 0.0);

        Double todayRevenueDouble = paymentRepository.sumByPaymentStatus("Paid").orElse(0.0);
        // For todayRevenue we compute from payments made today
        List<Reservation> allReservations = reservationRepository.findAll();
        BigDecimal todayRev = allReservations.stream()
                .filter(r -> r.getPayment() != null && "Paid".equals(r.getPayment().getPaymentStatus())
                        && today.equals(r.getPayment().getPaymentDate()))
                .map(r -> BigDecimal.valueOf(r.getPayment().getAmount()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        stats.setTodayRevenue(todayRev);
        stats.setTotalRevenue(totalRevenue);

        // Guest counts
        stats.setTotalGuests(guestRepository.count());

        // Staff count (admins that are not role ADMIN)
        List<com.fizzohotels.entity.Admin> allAdmins = adminRepository.findAll();
        long totalStaff = allAdmins.stream()
                .filter(a -> !"ADMIN".equals(a.getRole()))
                .count();
        stats.setTotalStaff(totalStaff);

        // Pending maintenance
        stats.setPendingMaintenance(maintenanceRequestRepository.countByStatus("PENDING"));

        // Pending payments
        long pendingPayments = invoiceRepository.countByStatus("PENDING") + invoiceRepository.countByStatus("UNPAID");
        stats.setPendingPayments(pendingPayments);

        // Monthly revenue
        stats.setMonthlyRevenue(buildMonthlyRevenue());

        // Occupancy trend (last 7 days)
        stats.setOccupancyTrend(buildOccupancyTrend());

        // Room availability breakdown
        stats.setRoomAvailability(buildRoomAvailability(totalRooms, availableRooms, occupiedRooms, reservedRooms, maintenanceRooms));

        // Booking sources (payment methods)
        stats.setBookingSources(buildBookingSources());

        // Recent reservations
        stats.setRecentReservations(buildRecentReservations());

        // Today arrivals
        stats.setTodayArrivals(todayCheckInList.stream()
                .map(r -> {
                    Map<String, Object> map = new LinkedHashMap<>();
                    map.put("reservationId", r.getReservationId());
                    map.put("guestName", r.getGuest() != null ? r.getGuest().getFirstName() + " " + r.getGuest().getLastName() : "N/A");
                    map.put("roomNumber", r.getRoom() != null ? r.getRoom().getRoomNumber() : "N/A");
                    map.put("roomType", r.getRoom() != null ? r.getRoom().getRoomType() : "N/A");
                    map.put("checkInDate", r.getCheckInDate().toString());
                    map.put("totalPrice", r.getTotalPrice());
                    map.put("status", r.getReservationStatus());
                    return map;
                })
                .collect(Collectors.toList()));

        // Today departures
        stats.setTodayDepartures(todayCheckOutList.stream()
                .map(r -> {
                    Map<String, Object> map = new LinkedHashMap<>();
                    map.put("reservationId", r.getReservationId());
                    map.put("guestName", r.getGuest() != null ? r.getGuest().getFirstName() + " " + r.getGuest().getLastName() : "N/A");
                    map.put("roomNumber", r.getRoom() != null ? r.getRoom().getRoomNumber() : "N/A");
                    map.put("roomType", r.getRoom() != null ? r.getRoom().getRoomType() : "N/A");
                    map.put("checkOutDate", r.getCheckOutDate().toString());
                    map.put("totalPrice", r.getTotalPrice());
                    map.put("status", r.getReservationStatus());
                    return map;
                })
                .collect(Collectors.toList()));

        return stats;
    }

    private List<Map<String, Object>> buildMonthlyRevenue() {
        List<Object[]> monthlyData = reservationRepository.getMonthlyRevenue();
        List<Map<String, Object>> result = new ArrayList<>();
        for (Object[] row : monthlyData) {
            Map<String, Object> map = new LinkedHashMap<>();
            int monthNum = ((Number) row[0]).intValue();
            map.put("month", Month.of(monthNum).name());
            map.put("revenue", row[1]);
            result.add(map);
        }
        return result;
    }

    private List<Map<String, Object>> buildOccupancyTrend() {
        List<Map<String, Object>> trend = new ArrayList<>();
        LocalDate today = LocalDate.now();
        for (int i = 6; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            long checkIns = reservationRepository.findByCheckInDate(date).stream()
                    .filter(r -> !"Cancelled".equals(r.getReservationStatus()))
                    .count();
            long checkOuts = reservationRepository.findByCheckOutDate(date).stream()
                    .filter(r -> !"Cancelled".equals(r.getReservationStatus()))
                    .count();

            Map<String, Object> map = new LinkedHashMap<>();
            map.put("date", date.toString());
            map.put("checkIns", checkIns);
            map.put("checkOuts", checkOuts);
            map.put("netOccupancy", checkIns - checkOuts);
            trend.add(map);
        }
        return trend;
    }

    private List<Map<String, Object>> buildRoomAvailability(long total, long available, long occupied, long reserved, long maintenance) {
        List<Map<String, Object>> list = new ArrayList<>();
        list.add(createAvailabilityEntry("Available", available, total));
        list.add(createAvailabilityEntry("Occupied", occupied, total));
        list.add(createAvailabilityEntry("Reserved", reserved, total));
        list.add(createAvailabilityEntry("Maintenance", maintenance, total));
        return list;
    }

    private Map<String, Object> createAvailabilityEntry(String status, long count, long total) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("status", status);
        map.put("count", count);
        map.put("percentage", total > 0 ? Math.round((double) count / total * 1000.0) / 10.0 : 0);
        return map;
    }

    private List<Map<String, Object>> buildBookingSources() {
        List<Object[]> sourceData = paymentRepository.countByPaymentMethod();
        List<Map<String, Object>> result = new ArrayList<>();
        for (Object[] row : sourceData) {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("source", row[0]);
            map.put("count", row[1]);
            result.add(map);
        }
        return result;
    }

    private List<Map<String, Object>> buildRecentReservations() {
        List<Reservation> recent = reservationRepository.findAll().stream()
                .sorted(Comparator.comparing(Reservation::getReservationId).reversed())
                .limit(5)
                .collect(Collectors.toList());
        return recent.stream()
                .map(r -> {
                    Map<String, Object> map = new LinkedHashMap<>();
                    map.put("reservationId", r.getReservationId());
                    map.put("guestName", r.getGuest() != null ? r.getGuest().getFirstName() + " " + r.getGuest().getLastName() : "N/A");
                    map.put("roomNumber", r.getRoom() != null ? r.getRoom().getRoomNumber() : "N/A");
                    map.put("checkInDate", r.getCheckInDate().toString());
                    map.put("checkOutDate", r.getCheckOutDate().toString());
                    map.put("totalPrice", r.getTotalPrice());
                    map.put("status", r.getReservationStatus());
                    return map;
                })
                .collect(Collectors.toList());
    }
}
