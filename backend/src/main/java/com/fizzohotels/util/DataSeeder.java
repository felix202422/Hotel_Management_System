package com.fizzohotels.util;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.fizzohotels.entity.*;
import com.fizzohotels.repository.*;

@Component
public class DataSeeder {

    @Autowired private AdminRepository adminRepository;
    @Autowired private RoomRepository roomRepository;
    @Autowired private GuestRepository guestRepository;
    @Autowired private ReservationRepository reservationRepository;
    @Autowired private PaymentRepository paymentRepository;
    @Autowired private HousekeepingRepository housekeepingRepository;
    @Autowired private MaintenanceRequestRepository maintenanceRequestRepository;
    @Autowired private NotificationRepository notificationRepository;
    @Autowired private AuditLogRepository auditLogRepository;
    @Autowired private ExpenseRepository expenseRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @PostConstruct
    public void seed() {
        seedAdmins();
        seedRooms();
        seedGuests();
        seedReservations();
        seedPayments();
        seedHousekeeping();
        seedMaintenanceRequests();
        seedNotifications();
        seedAuditLogs();
        seedExpenses();
    }

    private void seedAdmins() {
        if (adminRepository.count() > 0) return;

        adminRepository.save(createAdmin("System Admin", "admin@fizzohotels.com",
                "admin123", "admin", "ADMIN", "+255700000001", "Administration", "System Administrator"));

        adminRepository.save(createAdmin("James Manager", "manager@fizzohotels.com",
                "manager123", "manager", "MANAGER", "+255700000002", "Management", "Hotel Manager"));

        adminRepository.save(createAdmin("Sarah Secretary", "secretary@fizzohotels.com",
                "secretary123", "secretary", "SECRETARY", "+255700000003", "Front Desk", "Secretary"));

        adminRepository.save(createAdmin("Maria Housekeeper", "housekeeper@fizzohotels.com",
                "housekeeper123", "housekeeper", "HOUSEKEEPING_STAFF", "+255700000004", "Housekeeping", "Head Housekeeper"));

        adminRepository.save(createAdmin("David Accountant", "accountant@fizzohotels.com",
                "accountant123", "accountant", "ACCOUNTANT", "+255700000005", "Finance", "Accountant"));

        adminRepository.save(createAdmin("Peter Maintenance", "maintenance@fizzohotels.com",
                "maintenance123", "maintenance", "MAINTENANCE_STAFF", "+255700000006", "Maintenance", "Maintenance Officer"));

        adminRepository.save(createAdmin("Linda Maintenance", "linda.maintenance@fizzohotels.com",
                "maintenance123", "linda.maintenance", "MAINTENANCE_STAFF", "+255700000007", "Maintenance", "Maintenance Staff"));

        System.out.println("7 admin/staff users created.");
    }

    private Admin createAdmin(String name, String email, String password, String username,
                               String role, String phone, String department, String position) {
        Admin admin = new Admin();
        admin.setFullName(name);
        admin.setEmail(email);
        admin.setPassword(passwordEncoder.encode(password));
        admin.setUsername(username);
        admin.setRole(role);
        admin.setPhone(phone);
        admin.setDepartment(department);
        admin.setPosition(position);
        admin.setStatus("Active");
        return admin;
    }

    private void seedRooms() {
        if (roomRepository.count() > 0) return;

        roomRepository.save(createRoom("101", "Deluxe Suite", 1, 2, 150.00, "Available"));
        roomRepository.save(createRoom("102", "Executive Suite", 1, 2, 200.00, "Available"));
        roomRepository.save(createRoom("103", "Standard Room", 1, 2, 100.00, "Available"));
        roomRepository.save(createRoom("201", "Deluxe Suite", 2, 3, 180.00, "Available"));
        roomRepository.save(createRoom("202", "Executive Suite", 2, 2, 220.00, "Available"));
        roomRepository.save(createRoom("203", "Standard Room", 2, 2, 120.00, "Available"));
        roomRepository.save(createRoom("204", "Presidential Suite", 2, 4, 500.00, "Available"));
        roomRepository.save(createRoom("301", "Standard Room", 3, 2, 110.00, "Available"));
        roomRepository.save(createRoom("302", "Deluxe Suite", 3, 3, 190.00, "Available"));
        roomRepository.save(createRoom("303", "Executive Suite", 3, 2, 250.00, "Available"));
        roomRepository.save(createRoom("304", "Standard Room", 3, 2, 130.00, "Available"));
        roomRepository.save(createRoom("401", "Presidential Suite", 4, 4, 600.00, "Available"));
        roomRepository.save(createRoom("402", "Deluxe Suite", 4, 2, 170.00, "Available"));
        roomRepository.save(createRoom("403", "Standard Room", 4, 2, 105.00, "Available"));
        roomRepository.save(createRoom("501", "Executive Suite", 5, 3, 280.00, "Available"));
        roomRepository.save(createRoom("502", "Standard Room", 5, 2, 115.00, "Available"));
        roomRepository.save(createRoom("503", "Deluxe Suite", 5, 2, 160.00, "Available"));
        roomRepository.save(createRoom("601", "Presidential Suite", 6, 4, 750.00, "Available"));
        roomRepository.save(createRoom("602", "Standard Room", 6, 2, 125.00, "Available"));
        roomRepository.save(createRoom("603", "Executive Suite", 6, 2, 230.00, "Available"));

        System.out.println("20 rooms created.");
    }

    private Room createRoom(String number, String type, int floor, int capacity, double price, String status) {
        Room room = new Room();
        room.setRoomNumber(number);
        room.setRoomType(type);
        room.setFloor(floor);
        room.setCapacity(capacity);
        room.setPricePerNight(BigDecimal.valueOf(price));
        room.setRoomStatus(status);
        return room;
    }

    private void seedGuests() {
        if (guestRepository.count() > 0) return;

        List<Guest> guests = List.of(
            new Guest("John", "Carter", "Male", "+1234567890", "john.carter@email.com", "American", "123 Main St, New York"),
            new Guest("Emily", "Brown", "Female", "+1234567891", "emily.brown@email.com", "British", "45 London Rd, London"),
            new Guest("Sophia", "Miller", "Female", "+1234567892", "sophia.miller@email.com", "Canadian", "78 Maple Ave, Toronto"),
            new Guest("David", "Wilson", "Male", "+1234567893", "david.wilson@email.com", "Australian", "12 Ocean Dr, Sydney"),
            new Guest("Grace", "Johnson", "Female", "+1234567894", "grace.johnson@email.com", "American", "56 Park Blvd, Chicago"),
            new Guest("James", "Anderson", "Male", "+1234567895", "james.anderson@email.com", "British", "90 King St, Manchester"),
            new Guest("Olivia", "Martinez", "Female", "+1234567896", "olivia.martinez@email.com", "Spanish", "34 Calle Mayor, Madrid"),
            new Guest("William", "Taylor", "Male", "+1234567897", "william.taylor@email.com", "Canadian", "67 Bay St, Toronto"),
            new Guest("Emma", "Thomas", "Female", "+1234567898", "emma.thomas@email.com", "Australian", "23 Queen Rd, Melbourne"),
            new Guest("Alexander", "Lee", "Male", "+1234567899", "alexander.lee@email.com", "Singaporean", "89 Orchard Rd, Singapore"),
            new Guest("Michael", "Davis", "Male", "+1234567900", "michael.davis@email.com", "American", "150 Elm St, Boston"),
            new Guest("Isabella", "Garcia", "Female", "+1234567901", "isabella.garcia@email.com", "Mexican", "22 Reforma Ave, Mexico City"),
            new Guest("Daniel", "Rodriguez", "Male", "+1234567902", "daniel.rodriguez@email.com", "Spanish", "7 Gran Via, Barcelona"),
            new Guest("Mia", "Williams", "Female", "+1234567903", "mia.williams@email.com", "American", "88 Sunset Blvd, Los Angeles"),
            new Guest("Ethan", "Jones", "Male", "+1234567904", "ethan.jones@email.com", "British", "32 Baker St, London"),
            new Guest("Ava", "Jackson", "Female", "+1234567905", "ava.jackson@email.com", "Canadian", "14 Queen St West, Toronto"),
            new Guest("Liam", "Harris", "Male", "+1234567906", "liam.harris@email.com", "Australian", "5 George St, Sydney"),
            new Guest("Charlotte", "Nelson", "Female", "+1234567907", "charlotte.nelson@email.com", "British", "42 Oxford Rd, Manchester"),
            new Guest("Lucas", "White", "Male", "+1234567908", "lucas.white@email.com", "American", "77 Cherry Ln, Seattle"),
            new Guest("Amelia", "Clark", "Female", "+1234567909", "amelia.clark@email.com", "Canadian", "19 Harbour St, Vancouver")
        );

        guestRepository.saveAll(guests);
        System.out.println("20 guests created.");
    }

    private void seedReservations() {
        if (reservationRepository.count() > 0) return;

        List<Room> rooms = roomRepository.findAll();
        List<Guest> guests = guestRepository.findAll();

        Reservation[] reservations = {
            createReservation(guests.get(0), rooms.get(0), LocalDate.of(2026, 4, 5), LocalDate.of(2026, 4, 8), "Checked-Out"),
            createReservation(guests.get(1), rooms.get(5), LocalDate.of(2026, 4, 12), LocalDate.of(2026, 4, 15), "Checked-Out"),
            createReservation(guests.get(2), rooms.get(1), LocalDate.of(2026, 4, 20), LocalDate.of(2026, 4, 25), "Checked-Out"),
            createReservation(guests.get(3), rooms.get(8), LocalDate.of(2026, 5, 3), LocalDate.of(2026, 5, 6), "Checked-Out"),
            createReservation(guests.get(4), rooms.get(6), LocalDate.of(2026, 5, 10), LocalDate.of(2026, 5, 14), "Checked-Out"),
            createReservation(guests.get(5), rooms.get(13), LocalDate.of(2026, 5, 18), LocalDate.of(2026, 5, 22), "Checked-Out"),
            createReservation(guests.get(6), rooms.get(2), LocalDate.of(2026, 5, 25), LocalDate.of(2026, 5, 28), "Checked-Out"),
            createReservation(guests.get(7), rooms.get(16), LocalDate.of(2026, 6, 1), LocalDate.of(2026, 6, 5), "Checked-Out"),
            createReservation(guests.get(8), rooms.get(10), LocalDate.of(2026, 6, 8), LocalDate.of(2026, 6, 12), "Checked-Out"),
            createReservation(guests.get(9), rooms.get(18), LocalDate.of(2026, 6, 15), LocalDate.of(2026, 6, 18), "Checked-Out"),
            createReservation(guests.get(10), rooms.get(3), LocalDate.of(2026, 6, 20), LocalDate.of(2026, 6, 25), "Checked-Out"),
            createReservation(guests.get(11), rooms.get(11), LocalDate.of(2026, 6, 22), LocalDate.of(2026, 6, 27), "Checked-Out"),
            createReservation(guests.get(12), rooms.get(14), LocalDate.of(2026, 7, 1), LocalDate.of(2026, 7, 5), "Checked-Out"),
            createReservation(guests.get(13), rooms.get(7), LocalDate.of(2026, 7, 5), LocalDate.of(2026, 7, 8), "Checked-Out"),
            createReservation(guests.get(14), rooms.get(17), LocalDate.of(2026, 7, 10), LocalDate.of(2026, 7, 15), "Checked-Out"),
            createReservation(guests.get(15), rooms.get(4), LocalDate.of(2026, 7, 12), LocalDate.of(2026, 7, 18), "Checked-Out"),
            createReservation(guests.get(16), rooms.get(9), LocalDate.of(2026, 7, 15), LocalDate.of(2026, 7, 20), "Reserved"),
            createReservation(guests.get(17), rooms.get(1), LocalDate.of(2026, 7, 20), LocalDate.of(2026, 7, 25), "Reserved"),
            createReservation(guests.get(18), rooms.get(15), LocalDate.of(2026, 7, 22), LocalDate.of(2026, 7, 28), "Reserved"),
            createReservation(guests.get(19), rooms.get(12), LocalDate.of(2026, 7, 25), LocalDate.of(2026, 7, 30), "Reserved"),
            createReservation(guests.get(0), rooms.get(19), LocalDate.of(2026, 7, 28), LocalDate.of(2026, 8, 2), "Reserved"),
            createReservation(guests.get(1), rooms.get(0), LocalDate.of(2026, 8, 1), LocalDate.of(2026, 8, 5), "Checked-In"),
            createReservation(guests.get(2), rooms.get(5), LocalDate.of(2026, 8, 1), LocalDate.of(2026, 8, 8), "Checked-In"),
            createReservation(guests.get(3), rooms.get(2), LocalDate.of(2026, 8, 5), LocalDate.of(2026, 8, 7), "Checked-In"),
            createReservation(guests.get(4), rooms.get(18), LocalDate.of(2026, 8, 8), LocalDate.of(2026, 8, 12), "Checked-In"),
            createReservation(guests.get(5), rooms.get(6), LocalDate.of(2026, 8, 10), LocalDate.of(2026, 8, 14), "Reserved"),
            createReservation(guests.get(6), rooms.get(8), LocalDate.of(2026, 8, 12), LocalDate.of(2026, 8, 15), "Reserved"),
            createReservation(guests.get(7), rooms.get(3), LocalDate.of(2026, 8, 15), LocalDate.of(2026, 8, 18), "Pending"),
            createReservation(guests.get(8), rooms.get(10), LocalDate.of(2026, 8, 18), LocalDate.of(2026, 8, 22), "Pending"),
            createReservation(guests.get(9), rooms.get(16), LocalDate.of(2026, 8, 20), LocalDate.of(2026, 8, 25), "Pending"),
            createReservation(guests.get(10), rooms.get(11), LocalDate.of(2026, 6, 10), LocalDate.of(2026, 6, 13), "Cancelled"),
            createReservation(guests.get(11), rooms.get(14), LocalDate.of(2026, 7, 8), LocalDate.of(2026, 7, 11), "Cancelled")
        };

        for (Reservation r : reservations) {
            long nights = java.time.temporal.ChronoUnit.DAYS.between(r.getCheckInDate(), r.getCheckOutDate());
            if (nights <= 0) nights = 1;
            r.setTotalPrice(r.getRoom().getPricePerNight().doubleValue() * nights);
            reservationRepository.save(r);

            switch (r.getReservationStatus()) {
                case "Checked-In":
                    updateRoomStatus(r.getRoom(), "Occupied");
                    break;
                case "Reserved":
                    updateRoomStatus(r.getRoom(), "Reserved");
                    break;
                case "Checked-Out":
                case "Cancelled":
                    updateRoomStatus(r.getRoom(), "Available");
                    break;
            }
        }
        System.out.println("32 reservations created.");
    }

    private Reservation createReservation(Guest guest, Room room, LocalDate checkIn, LocalDate checkOut, String status) {
        Reservation r = new Reservation();
        r.setGuest(guest);
        r.setRoom(room);
        r.setCheckInDate(checkIn);
        r.setCheckOutDate(checkOut);
        r.setReservationStatus(status);
        return r;
    }

    private void updateRoomStatus(Room room, String status) {
        room.setRoomStatus(status);
        roomRepository.save(room);
    }

    private void seedPayments() {
        if (paymentRepository.count() > 0) return;

        List<Reservation> reservations = reservationRepository.findAll();

        Payment[] payments = {
            createPayment(reservations.get(0), "Credit Card", LocalDate.of(2026, 4, 4), "Paid"),
            createPayment(reservations.get(1), "Cash", LocalDate.of(2026, 4, 11), "Paid"),
            createPayment(reservations.get(2), "Credit Card", LocalDate.of(2026, 4, 19), "Paid"),
            createPayment(reservations.get(3), "Bank Transfer", LocalDate.of(2026, 5, 2), "Paid"),
            createPayment(reservations.get(4), "Mobile Payment", LocalDate.of(2026, 5, 9), "Paid"),
            createPayment(reservations.get(5), "Credit Card", LocalDate.of(2026, 5, 17), "Paid"),
            createPayment(reservations.get(6), "Cash", LocalDate.of(2026, 5, 24), "Paid"),
            createPayment(reservations.get(7), "Credit Card", LocalDate.of(2026, 5, 31), "Paid"),
            createPayment(reservations.get(8), "Bank Transfer", LocalDate.of(2026, 6, 7), "Paid"),
            createPayment(reservations.get(9), "Mobile Payment", LocalDate.of(2026, 6, 14), "Paid"),
            createPayment(reservations.get(10), "Credit Card", LocalDate.of(2026, 6, 19), "Paid"),
            createPayment(reservations.get(11), "Cash", LocalDate.of(2026, 6, 21), "Paid"),
            createPayment(reservations.get(12), "Credit Card", LocalDate.of(2026, 6, 30), "Paid"),
            createPayment(reservations.get(13), "Bank Transfer", LocalDate.of(2026, 7, 4), "Paid"),
            createPayment(reservations.get(14), "Mobile Payment", LocalDate.of(2026, 7, 9), "Paid"),
            createPayment(reservations.get(15), "Cash", LocalDate.of(2026, 7, 11), "Paid"),
            createPayment(reservations.get(16), "Credit Card", LocalDate.of(2026, 7, 14), "Pending"),
            createPayment(reservations.get(17), "Cash", LocalDate.of(2026, 7, 19), "Pending"),
            createPayment(reservations.get(18), "Bank Transfer", LocalDate.of(2026, 7, 21), "Pending"),
            createPayment(reservations.get(19), "Mobile Payment", LocalDate.of(2026, 7, 24), "Pending"),
            createPayment(reservations.get(25), "Credit Card", LocalDate.of(2026, 8, 9), "Pending"),
            createPayment(reservations.get(27), "Bank Transfer", LocalDate.of(2026, 8, 14), "Pending"),
            createPayment(reservations.get(28), "Mobile Payment", LocalDate.of(2026, 8, 17), "Pending")
        };

        for (Payment p : payments) {
            double amount = p.getReservation().getTotalPrice();
            p.setAmount(amount);
            paymentRepository.save(p);
        }
        System.out.println("23 payments created.");
    }

    private Payment createPayment(Reservation reservation, String method, LocalDate date, String status) {
        Payment p = new Payment();
        p.setReservation(reservation);
        p.setPaymentMethod(method);
        p.setPaymentDate(date);
        p.setPaymentStatus(status);
        return p;
    }

    private void seedHousekeeping() {
        if (housekeepingRepository.count() > 0) return;

        List<Room> rooms = roomRepository.findAll();

        Housekeeping[] records = {
            createHousekeeping(rooms.get(0), "Maria Santos", "Completed", LocalDate.of(2026, 7, 28)),
            createHousekeeping(rooms.get(1), "John Smith", "Completed", LocalDate.of(2026, 7, 28)),
            createHousekeeping(rooms.get(2), "Anna Kim", "In Progress", LocalDate.of(2026, 7, 29)),
            createHousekeeping(rooms.get(3), "Robert Chen", "Pending", null),
            createHousekeeping(rooms.get(4), "Maria Santos", "Completed", LocalDate.of(2026, 7, 27)),
            createHousekeeping(rooms.get(5), "John Smith", "Completed", LocalDate.of(2026, 7, 27)),
            createHousekeeping(rooms.get(6), "Anna Kim", "Completed", LocalDate.of(2026, 7, 26)),
            createHousekeeping(rooms.get(7), "Robert Chen", "In Progress", LocalDate.of(2026, 7, 29)),
            createHousekeeping(rooms.get(8), "John Smith", "Pending", null),
            createHousekeeping(rooms.get(9), "Maria Santos", "In Progress", LocalDate.of(2026, 7, 29)),
            createHousekeeping(rooms.get(10), "Anna Kim", "Pending", null),
            createHousekeeping(rooms.get(11), "Robert Chen", "Completed", LocalDate.of(2026, 7, 28)),
            createHousekeeping(rooms.get(12), "John Smith", "Completed", LocalDate.of(2026, 7, 25)),
            createHousekeeping(rooms.get(13), "Maria Santos", "In Progress", LocalDate.of(2026, 7, 29)),
            createHousekeeping(rooms.get(14), "Anna Kim", "Completed", LocalDate.of(2026, 7, 28)),
            createHousekeeping(rooms.get(15), "Robert Chen", "Pending", null),
            createHousekeeping(rooms.get(16), "Maria Santos", "Completed", LocalDate.of(2026, 7, 28)),
            createHousekeeping(rooms.get(17), "John Smith", "Completed", LocalDate.of(2026, 7, 27)),
            createHousekeeping(rooms.get(18), "Anna Kim", "Pending", null),
            createHousekeeping(rooms.get(19), "Robert Chen", "Completed", LocalDate.of(2026, 7, 26))
        };

        housekeepingRepository.saveAll(List.of(records));
        System.out.println("20 housekeeping records created.");
    }

    private Housekeeping createHousekeeping(Room room, String staff, String status, LocalDate date) {
        Housekeeping h = new Housekeeping();
        h.setRoom(room);
        h.setAssignedStaff(staff);
        h.setCleaningStatus(status);
        h.setCleanedDate(date);
        return h;
    }

    private void seedMaintenanceRequests() {
        if (maintenanceRequestRepository.count() > 0) return;

        List<Room> rooms = roomRepository.findAll();

        maintenanceRequestRepository.save(createMaintenance(rooms.get(0), "Leaking faucet in bathroom", "High", "PENDING", "Peter Maintenance", "Plumbing", LocalDate.of(2026, 7, 20)));
        maintenanceRequestRepository.save(createMaintenance(rooms.get(1), "Air conditioning not cooling", "High", "IN_PROGRESS", "Peter Maintenance", "HVAC", LocalDate.of(2026, 7, 22)));
        maintenanceRequestRepository.save(createMaintenance(rooms.get(2), "Broken lamp on nightstand", "Low", "COMPLETED", "Linda Maintenance", "Electrical", LocalDate.of(2026, 7, 15), LocalDate.of(2026, 7, 16)));
        maintenanceRequestRepository.save(createMaintenance(rooms.get(4), "Carpet stain needs deep cleaning", "Medium", "PENDING", "Maria Santos", "Cleaning", LocalDate.of(2026, 7, 25)));
        maintenanceRequestRepository.save(createMaintenance(rooms.get(5), "Door handle loose", "Low", "COMPLETED", "Linda Maintenance", "General", LocalDate.of(2026, 7, 10), LocalDate.of(2026, 7, 11)));
        maintenanceRequestRepository.save(createMaintenance(rooms.get(8), "TV remote not working", "Low", "PENDING", "Peter Maintenance", "Electrical", LocalDate.of(2026, 7, 28)));
        maintenanceRequestRepository.save(createMaintenance(rooms.get(10), "Shower drain clogged", "Medium", "IN_PROGRESS", "Peter Maintenance", "Plumbing", LocalDate.of(2026, 7, 24)));
        maintenanceRequestRepository.save(createMaintenance(rooms.get(12), "Wall paint chipping", "Medium", "PENDING", "Linda Maintenance", "Maintenance", LocalDate.of(2026, 7, 27)));
        maintenanceRequestRepository.save(createMaintenance(rooms.get(14), "Mini fridge making noise", "Low", "COMPLETED", "Peter Maintenance", "Electrical", LocalDate.of(2026, 7, 5), LocalDate.of(2026, 7, 7)));
        maintenanceRequestRepository.save(createMaintenance(rooms.get(17), "Window blind broken", "Medium", "IN_PROGRESS", "Linda Maintenance", "General", LocalDate.of(2026, 7, 23)));

        System.out.println("10 maintenance requests created.");
    }

    private MaintenanceRequest createMaintenance(Room room, String desc, String priority, String status,
                                                   String assignedTo, String category, LocalDate reported) {
        MaintenanceRequest m = new MaintenanceRequest();
        m.setRoom(room);
        m.setDescription(desc);
        m.setPriority(priority);
        m.setStatus(status);
        m.setAssignedTo(assignedTo);
        m.setCategory(category);
        m.setReportedDate(reported);
        return m;
    }

    private MaintenanceRequest createMaintenance(Room room, String desc, String priority, String status,
                                                   String assignedTo, String category, LocalDate reported,
                                                   LocalDate completed) {
        MaintenanceRequest m = createMaintenance(room, desc, priority, status, assignedTo, category, reported);
        m.setCompletedDate(completed);
        return m;
    }

    private void seedNotifications() {
        if (notificationRepository.count() > 0) return;

        Long adminId = adminRepository.findByUsername("admin").map(Admin::getId).orElse(1L);
        Long managerId = adminRepository.findByUsername("manager").map(Admin::getId).orElse(2L);
        Long housekeeperId = adminRepository.findByUsername("housekeeper").map(Admin::getId).orElse(4L);
        Long maintenanceId = adminRepository.findByUsername("maintenance").map(Admin::getId).orElse(6L);

        notificationRepository.save(createNotification(adminId, "New Reservation", "Guest John Carter has made a new reservation for Room 101", "RESERVATION", "Reservation", 1L, LocalDateTime.now().minusDays(3)));
        notificationRepository.save(createNotification(adminId, "Payment Received", "Payment of $450 received from Emily Brown", "PAYMENT", "Payment", 1L, LocalDateTime.now().minusDays(2)));
        notificationRepository.save(createNotification(managerId, "Check-in Alert", "3 guests scheduled for check-in today", "ALERT", "Reservation", null, LocalDateTime.now().minusDays(1)));
        notificationRepository.save(createNotification(managerId, "Revenue Update", "Monthly revenue target achieved", "INFO", "Report", null, LocalDateTime.now().minusHours(12)));
        notificationRepository.save(createNotification(housekeeperId, "Cleaning Assignment", "Room 302 assigned for deep cleaning", "TASK", "Housekeeping", 2L, LocalDateTime.now().minusHours(6)));
        notificationRepository.save(createNotification(housekeeperId, "Cleaning Completed", "Room 101 cleaning completed", "UPDATE", "Housekeeping", 1L, LocalDateTime.now().minusHours(3)));
        notificationRepository.save(createNotification(maintenanceId, "Maintenance Request", "AC repair needed in Room 202", "MAINTENANCE", "MaintenanceRequest", 2L, LocalDateTime.now().minusDays(1)));
        notificationRepository.save(createNotification(maintenanceId, "Maintenance Completed", "Faucet repair in Room 101 completed", "UPDATE", "MaintenanceRequest", 1L, LocalDateTime.now().minusHours(8)));
        notificationRepository.save(createNotification(adminId, "System Alert", "Low inventory alert for cleaning supplies", "ALERT", null, null, LocalDateTime.now().minusDays(5)));
        notificationRepository.save(createNotification(managerId, "Staff Schedule", "Housekeeping schedule updated for next week", "INFO", null, null, LocalDateTime.now().minusDays(2)));
        notificationRepository.save(createNotification(adminId, "New Guest Registration", "5 new guests registered this month", "INFO", "Guest", null, LocalDateTime.now().minusDays(1)));
        notificationRepository.save(createNotification(housekeeperId, "Room Inspection", "Floor 3 rooms need inspection", "TASK", "Housekeeping", null, LocalDateTime.now().minusHours(4)));
        notificationRepository.save(createNotification(maintenanceId, "Urgent Repair", "Water heater malfunction in Room 601", "URGENT", "MaintenanceRequest", null, LocalDateTime.now().minusHours(2)));
        notificationRepository.save(createNotification(managerId, "Monthly Report", "July financial report is ready", "INFO", "Report", null, LocalDateTime.now().minusHours(1)));
        notificationRepository.save(createNotification(adminId, "Security Alert", "Unauthorized access attempt detected", "SECURITY", null, null, LocalDateTime.now().minusMinutes(30)));

        System.out.println("15 notifications created.");
    }

    private Notification createNotification(Long userId, String title, String message, String type,
                                             String relatedEntity, Long relatedEntityId, LocalDateTime createdAt) {
        Notification n = new Notification();
        n.setUserId(userId);
        n.setTitle(title);
        n.setMessage(message);
        n.setType(type);
        n.setRead(false);
        n.setRelatedEntity(relatedEntity);
        n.setRelatedEntityId(relatedEntityId);
        n.setCreatedAt(createdAt);
        return n;
    }

    private void seedAuditLogs() {
        if (auditLogRepository.count() > 0) return;

        auditLogRepository.save(createAuditLog("1", "admin", "LOGIN", "Admin logged in", "Admin", 1L, "192.168.1.100", LocalDateTime.now().minusDays(5)));
        auditLogRepository.save(createAuditLog("1", "admin", "CREATE", "Created new room 101", "Room", 1L, "192.168.1.100", LocalDateTime.now().minusDays(5)));
        auditLogRepository.save(createAuditLog("2", "manager", "LOGIN", "Manager logged in", "Admin", 2L, "192.168.1.101", LocalDateTime.now().minusDays(4)));
        auditLogRepository.save(createAuditLog("2", "manager", "UPDATE", "Updated reservation status", "Reservation", 1L, "192.168.1.101", LocalDateTime.now().minusDays(4)));
        auditLogRepository.save(createAuditLog("1", "admin", "CREATE", "Created new guest record", "Guest", 1L, "192.168.1.100", LocalDateTime.now().minusDays(3)));
        auditLogRepository.save(createAuditLog("3", "secretary", "LOGIN", "Secretary logged in", "Admin", 3L, "192.168.1.102", LocalDateTime.now().minusDays(3)));
        auditLogRepository.save(createAuditLog("3", "secretary", "CREATE", "Created reservation for John Carter", "Reservation", 1L, "192.168.1.102", LocalDateTime.now().minusDays(2)));
        auditLogRepository.save(createAuditLog("1", "admin", "UPDATE", "Updated room pricing", "Room", null, "192.168.1.100", LocalDateTime.now().minusDays(2)));
        auditLogRepository.save(createAuditLog("4", "housekeeper", "UPDATE", "Marked Room 101 cleaning complete", "Housekeeping", 1L, "192.168.1.103", LocalDateTime.now().minusDays(1)));
        auditLogRepository.save(createAuditLog("1", "admin", "DELETE", "Deleted expired reservation", "Reservation", null, "192.168.1.100", LocalDateTime.now().minusHours(6)));

        System.out.println("10 audit log entries created.");
    }

    private AuditLog createAuditLog(String userId, String username, String action, String description,
                                      String entityType, Long entityId, String ipAddress, LocalDateTime timestamp) {
        AuditLog log = new AuditLog();
        log.setUserId(userId);
        log.setUsername(username);
        log.setAction(action);
        log.setDescription(description);
        log.setEntityType(entityType);
        log.setEntityId(entityId);
        log.setIpAddress(ipAddress);
        log.setTimestamp(timestamp);
        return log;
    }

    private void seedExpenses() {
        if (expenseRepository.count() > 0) return;

        expenseRepository.save(createExpense("Utilities", "Monthly electricity bill for July", 2500.00, LocalDate.of(2026, 7, 1), "Approved", "David Accountant"));
        expenseRepository.save(createExpense("Maintenance", "Plumbing supplies for bathroom repairs", 450.00, LocalDate.of(2026, 7, 5), "Approved", "David Accountant"));
        expenseRepository.save(createExpense("Cleaning", "Cleaning supplies bulk purchase", 320.00, LocalDate.of(2026, 7, 10), "Approved", "David Accountant"));
        expenseRepository.save(createExpense("Staff", "Overtime payments for housekeeping team", 1800.00, LocalDate.of(2026, 7, 15), "Pending", "David Accountant"));
        expenseRepository.save(createExpense("Food & Beverage", "Mini-bar restocking for all floors", 680.00, LocalDate.of(2026, 7, 20), "Approved", "David Accountant"));

        System.out.println("5 expenses created.");
    }

    private Expense createExpense(String category, String description, double amount, LocalDate date, String status, String recordedBy) {
        Expense e = new Expense();
        e.setCategory(category);
        e.setDescription(description);
        e.setAmount(amount);
        e.setExpenseDate(date);
        e.setStatus(status);
        e.setRecordedBy(recordedBy);
        return e;
    }
}
