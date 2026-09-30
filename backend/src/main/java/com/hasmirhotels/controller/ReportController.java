package com.hasmirhotels.controller;

import com.hasmirhotels.entity.Reservation;
import com.hasmirhotels.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final PaymentRepository paymentRepository;
    private final RoomRepository roomRepository;
    private final ReservationRepository reservationRepository;
    private final GuestRepository guestRepository;
    private final HousekeepingRepository housekeepingRepository;
    private final MaintenanceRequestRepository maintenanceRequestRepository;
    private final ExpenseRepository expenseRepository;

    public ReportController(PaymentRepository paymentRepository, RoomRepository roomRepository,
                            ReservationRepository reservationRepository, GuestRepository guestRepository,
                            HousekeepingRepository housekeepingRepository,
                            MaintenanceRequestRepository maintenanceRequestRepository,
                            ExpenseRepository expenseRepository) {
        this.paymentRepository = paymentRepository;
        this.roomRepository = roomRepository;
        this.reservationRepository = reservationRepository;
        this.guestRepository = guestRepository;
        this.housekeepingRepository = housekeepingRepository;
        this.maintenanceRequestRepository = maintenanceRequestRepository;
        this.expenseRepository = expenseRepository;
    }

    @GetMapping("/revenue")
    public ResponseEntity<Map<String, Object>> revenueReport() {
        Map<String, Object> report = new LinkedHashMap<>();
        report.put("reportType", "Revenue Report");
        report.put("generatedAt", LocalDateTime.now());

        Double totalRevenue = paymentRepository.getTotalRevenue();
        report.put("totalRevenue", totalRevenue != null ? totalRevenue : 0.0);

        List<Reservation> allReservations = reservationRepository.findAll();
        long months = allReservations.stream()
                .filter(r -> !"Cancelled".equals(r.getReservationStatus()))
                .map(r -> (LocalDate) r.getCheckInDate())
                .map(d -> YearMonth.from(d))
                .distinct()
                .count();
        double monthlyAvg = months > 0 ? (totalRevenue != null ? totalRevenue : 0.0) / months : 0.0;
        report.put("monthlyAverage", monthlyAvg);
        report.put("currency", "TZS");

        List<Object[]> byMethod = paymentRepository.countByPaymentMethod();
        List<Map<String, Object>> byMethodList = new ArrayList<>();
        for (Object[] row : byMethod) {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("method", row[0]);
            m.put("count", row[1]);
            byMethodList.add(m);
        }
        report.put("byMethod", byMethodList);

        return ResponseEntity.ok(report);
    }

    @GetMapping("/occupancy")
    public ResponseEntity<Map<String, Object>> occupancyReport() {
        Map<String, Object> report = new LinkedHashMap<>();
        report.put("reportType", "Occupancy Report");
        report.put("generatedAt", LocalDateTime.now());

        long totalRooms = roomRepository.count();
        long available = roomRepository.countByRoomStatus("Available");
        long occupied = roomRepository.countByRoomStatus("Occupied");
        long reserved = roomRepository.countByRoomStatus("Reserved");
        long maintenance = roomRepository.countByRoomStatus("Maintenance");

        report.put("totalRooms", totalRooms);
        report.put("availableRooms", available);
        report.put("occupiedRooms", occupied);
        report.put("reservedRooms", reserved);
        report.put("maintenanceRooms", maintenance);
        report.put("occupancyRate", totalRooms > 0 ? (occupied * 100.0 / totalRooms) : 0.0);

        List<String> types = List.of("Standard Room", "Deluxe Suite", "Executive Suite", "Presidential Suite");
        List<Map<String, Object>> byType = new ArrayList<>();
        for (String type : types) {
            long count = roomRepository.findByRoomType(type).size();
            long occupiedCount = roomRepository.findByRoomType(type).stream()
                    .filter(r -> "Occupied".equals(r.getRoomStatus()))
                    .count();
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("type", type);
            m.put("total", count);
            m.put("occupied", occupiedCount);
            byType.add(m);
        }
        report.put("byType", byType);

        return ResponseEntity.ok(report);
    }

    @GetMapping("/reservations")
    public ResponseEntity<Map<String, Object>> reservationReport() {
        Map<String, Object> report = new LinkedHashMap<>();
        report.put("reportType", "Reservation Report");
        report.put("generatedAt", LocalDateTime.now());

        long total = reservationRepository.count();
        long checkedOut = reservationRepository.countByReservationStatus("Checked-Out");
        long checkedIn = reservationRepository.countByReservationStatus("Checked-In");
        long reserved = reservationRepository.countByReservationStatus("Reserved");
        long cancelled = reservationRepository.countByReservationStatus("Cancelled");
        long pending = reservationRepository.countByReservationStatus("Pending");

        report.put("totalReservations", total);
        report.put("checkedOut", checkedOut);
        report.put("checkedIn", checkedIn);
        report.put("reserved", reserved);
        report.put("cancelled", cancelled);
        report.put("pending", pending);

        List<Map<String, Object>> statusList = new ArrayList<>();
        for (Map.Entry<String, Long> entry : Map.of(
                "Checked-Out", checkedOut, "Checked-In", checkedIn,
                "Reserved", reserved, "Cancelled", cancelled, "Pending", pending).entrySet()) {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("status", entry.getKey());
            m.put("count", entry.getValue());
            statusList.add(m);
        }
        report.put("byStatus", statusList);

        return ResponseEntity.ok(report);
    }

    @GetMapping("/guests")
    public ResponseEntity<Map<String, Object>> guestReport() {
        Map<String, Object> report = new LinkedHashMap<>();
        report.put("reportType", "Guest Report");
        report.put("generatedAt", LocalDateTime.now());

        long totalGuests = guestRepository.count();
        report.put("totalGuests", totalGuests);

        YearMonth thisMonth = YearMonth.now();
        LocalDate monthStart = thisMonth.atDay(1);
        long newThisMonth = reservationRepository.findAll().stream()
                .filter(r -> !"Cancelled".equals(r.getReservationStatus()))
                .filter(r -> !r.getCheckInDate().isBefore(monthStart))
                .map(r -> r.getGuest().getGuestId())
                .distinct()
                .count();
        report.put("newGuestsThisMonth", newThisMonth);

        List<String> topNationalities = guestRepository.findAll().stream()
                .map(g -> g.getNationality())
                .filter(Objects::nonNull)
                .collect(Collectors.groupingBy(n -> n, Collectors.counting()))
                .entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(5)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
        report.put("topNationalities", topNationalities);

        return ResponseEntity.ok(report);
    }

    @GetMapping("/payments")
    public ResponseEntity<Map<String, Object>> paymentReport() {
        Map<String, Object> report = new LinkedHashMap<>();
        report.put("reportType", "Payment Report");
        report.put("generatedAt", LocalDateTime.now());

        long totalPayments = paymentRepository.count();
        long paid = paymentRepository.countByPaymentStatus("Paid");
        long pending = paymentRepository.countByPaymentStatus("Pending");
        long failed = paymentRepository.countByPaymentStatus("Failed");

        report.put("totalPayments", totalPayments);
        report.put("completedPayments", paid);
        report.put("pendingPayments", pending);
        report.put("failedPayments", failed);

        Double totalCollected = paymentRepository.getTotalRevenue();
        report.put("totalAmountCollected", totalCollected != null ? totalCollected : 0.0);

        List<Object[]> byMethod = paymentRepository.countByPaymentMethod();
        List<Map<String, Object>> byMethodList = new ArrayList<>();
        for (Object[] row : byMethod) {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("method", row[0]);
            m.put("count", row[1]);
            byMethodList.add(m);
        }
        report.put("byMethod", byMethodList);

        return ResponseEntity.ok(report);
    }

    @GetMapping("/housekeeping")
    public ResponseEntity<Map<String, Object>> housekeepingReport() {
        Map<String, Object> report = new LinkedHashMap<>();
        report.put("reportType", "Housekeeping Report");
        report.put("generatedAt", LocalDateTime.now());

        long total = housekeepingRepository.count();
        long completed = housekeepingRepository.countByCleaningStatus("Completed");
        long pending = housekeepingRepository.countByCleaningStatus("Pending");
        long inProgress = housekeepingRepository.countByCleaningStatus("In Progress");

        report.put("totalTasks", total);
        report.put("completedTasks", completed);
        report.put("pendingTasks", pending);
        report.put("inProgressTasks", inProgress);

        return ResponseEntity.ok(report);
    }

    @GetMapping("/maintenance")
    public ResponseEntity<Map<String, Object>> maintenanceReport() {
        Map<String, Object> report = new LinkedHashMap<>();
        report.put("reportType", "Maintenance Report");
        report.put("generatedAt", LocalDateTime.now());

        long total = maintenanceRequestRepository.count();
        long pending = maintenanceRequestRepository.countByStatus("PENDING");
        long inProgress = maintenanceRequestRepository.countByStatus("IN_PROGRESS");
        long completed = maintenanceRequestRepository.countByStatus("COMPLETED");
        long highPriority = maintenanceRequestRepository.countByPriority("High");
        long mediumPriority = maintenanceRequestRepository.countByPriority("Medium");
        long lowPriority = maintenanceRequestRepository.countByPriority("Low");

        report.put("totalRequests", total);
        report.put("pendingRequests", pending);
        report.put("inProgressRequests", inProgress);
        report.put("completedRequests", completed);

        List<Map<String, Object>> byPriority = new ArrayList<>();
        for (Map.Entry<String, Long> entry : Map.of("High", highPriority, "Medium", mediumPriority, "Low", lowPriority).entrySet()) {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("priority", entry.getKey());
            m.put("count", entry.getValue());
            byPriority.add(m);
        }
        report.put("byPriority", byPriority);

        List<Map<String, Object>> byStatus = new ArrayList<>();
        for (Map.Entry<String, Long> entry : Map.of("PENDING", pending, "IN_PROGRESS", inProgress, "COMPLETED", completed).entrySet()) {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("status", entry.getKey());
            m.put("count", entry.getValue());
            byStatus.add(m);
        }
        report.put("byStatus", byStatus);

        return ResponseEntity.ok(report);
    }

    @GetMapping("/expenses")
    public ResponseEntity<Map<String, Object>> expenseReport() {
        Map<String, Object> report = new LinkedHashMap<>();
        report.put("reportType", "Expense Report");
        report.put("generatedAt", LocalDateTime.now());

        List<Object[]> byCategory = expenseRepository.sumExpensesByCategory();
        double totalExpenses = 0.0;
        List<Map<String, Object>> categoryList = new ArrayList<>();
        for (Object[] row : byCategory) {
            double amount = ((Number) row[1]).doubleValue();
            totalExpenses += amount;
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("category", row[0]);
            m.put("total", amount);
            categoryList.add(m);
        }

        report.put("totalExpenses", totalExpenses);
        report.put("byCategory", categoryList);

        return ResponseEntity.ok(report);
    }

    @GetMapping("/revenue/monthly")
    public ResponseEntity<Map<String, Object>> monthlyRevenue() {
        Map<String, Object> report = new LinkedHashMap<>();
        report.put("reportType", "Monthly Revenue");
        report.put("generatedAt", LocalDateTime.now());

        List<Object[]> monthlyData = reservationRepository.getMonthlyRevenue();
        List<Map<String, Object>> monthlyList = new ArrayList<>();
        for (Object[] row : monthlyData) {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("month", row[0]);
            m.put("revenue", row[1]);
            monthlyList.add(m);
        }
        report.put("monthlyData", monthlyList);

        return ResponseEntity.ok(report);
    }

    @GetMapping("/revenue/by-room-type")
    public ResponseEntity<Map<String, Object>> revenueByRoomType() {
        Map<String, Object> report = new LinkedHashMap<>();
        report.put("reportType", "Revenue By Room Type");
        report.put("generatedAt", LocalDateTime.now());

        List<String> types = List.of("Standard Room", "Deluxe Suite", "Executive Suite", "Presidential Suite");
        List<Map<String, Object>> byType = new ArrayList<>();

        for (String type : types) {
            double revenue = reservationRepository.findAll().stream()
                    .filter(r -> !"Cancelled".equals(r.getReservationStatus()))
                    .filter(r -> type.equals(r.getRoom().getRoomType()))
                    .mapToDouble(r -> r.getTotalPrice() != null ? r.getTotalPrice() : 0.0)
                    .sum();

            Map<String, Object> m = new LinkedHashMap<>();
            m.put("roomType", type);
            m.put("revenue", revenue);
            byType.add(m);
        }

        report.put("byRoomType", byType);
        return ResponseEntity.ok(report);
    }
}
