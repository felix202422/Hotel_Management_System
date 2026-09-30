-- ======================================================
-- Hasmir Hotels Database - Complete Schema & Data
-- ======================================================

-- Drop existing tables (order matters for foreign keys)
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS expenses CASCADE;
DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS reservations CASCADE;
DROP TABLE IF EXISTS housekeeping CASCADE;
DROP TABLE IF EXISTS maintenance_requests CASCADE;
DROP TABLE IF EXISTS rooms CASCADE;
DROP TABLE IF EXISTS guests CASCADE;
DROP TABLE IF EXISTS guest_users CASCADE;
DROP TABLE IF EXISTS admins CASCADE;

-- Drop sequences
DROP SEQUENCE IF EXISTS admins_id_seq CASCADE;
DROP SEQUENCE IF EXISTS rooms_room_id_seq CASCADE;
DROP SEQUENCE IF EXISTS guests_guest_id_seq CASCADE;
DROP SEQUENCE IF EXISTS reservations_reservation_id_seq CASCADE;
DROP SEQUENCE IF EXISTS payments_payment_id_seq CASCADE;
DROP SEQUENCE IF EXISTS housekeeping_housekeeping_id_seq CASCADE;
DROP SEQUENCE IF EXISTS maintenance_requests_maintenance_id_seq CASCADE;
DROP SEQUENCE IF EXISTS invoices_invoice_id_seq CASCADE;
DROP SEQUENCE IF EXISTS expenses_expense_id_seq CASCADE;
DROP SEQUENCE IF EXISTS notifications_notification_id_seq CASCADE;
DROP SEQUENCE IF EXISTS audit_logs_audit_id_seq CASCADE;
DROP SEQUENCE IF EXISTS guest_users_id_seq CASCADE;

-- ======================================================
-- CREATE TABLES
-- ======================================================

-- 1. Admins / Staff Users
CREATE TABLE admins (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    password VARCHAR(255),
    department VARCHAR(255),
    phone VARCHAR(255),
    position VARCHAR(255),
    profile_photo VARCHAR(255),
    role VARCHAR(255),
    status VARCHAR(255) DEFAULT 'Active',
    username VARCHAR(255) NOT NULL UNIQUE
);

-- 2. Guest Users (for self-registration/login)
CREATE TABLE guest_users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    password VARCHAR(255),
    phone VARCHAR(255),
    role VARCHAR(255) DEFAULT 'GUEST',
    status VARCHAR(255) DEFAULT 'Active',
    username VARCHAR(255) NOT NULL UNIQUE
);

-- 3. Guests (guest profiles linked to reservations)
CREATE TABLE guests (
    guest_id BIGSERIAL PRIMARY KEY,
    address VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    gender VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    nationality VARCHAR(255),
    phone VARCHAR(255) NOT NULL
);

-- 4. Rooms
CREATE TABLE rooms (
    room_id BIGSERIAL PRIMARY KEY,
    capacity INTEGER,
    floor INTEGER,
    price_per_night NUMERIC(10,2) NOT NULL,
    room_number VARCHAR(255) NOT NULL UNIQUE,
    room_status VARCHAR(255) NOT NULL DEFAULT 'Available',
    room_type VARCHAR(255) NOT NULL
);

-- 5. Reservations
CREATE TABLE reservations (
    reservation_id BIGSERIAL PRIMARY KEY,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    reservation_status VARCHAR(255) NOT NULL DEFAULT 'Reserved',
    total_price DOUBLE PRECISION NOT NULL,
    guest_id BIGINT NOT NULL REFERENCES guests(guest_id),
    guest_user_id BIGINT REFERENCES guest_users(id),
    room_id BIGINT NOT NULL REFERENCES rooms(room_id)
);

-- 6. Payments
CREATE TABLE payments (
    payment_id BIGSERIAL PRIMARY KEY,
    amount DOUBLE PRECISION,
    payment_date DATE,
    payment_method VARCHAR(255),
    payment_status VARCHAR(255),
    reservation_id BIGINT UNIQUE REFERENCES reservations(reservation_id)
);

-- 7. Housekeeping
CREATE TABLE housekeeping (
    housekeeping_id BIGSERIAL PRIMARY KEY,
    assigned_staff VARCHAR(255) NOT NULL,
    cleaned_date DATE,
    cleaning_status VARCHAR(255) NOT NULL DEFAULT 'Pending',
    room_id BIGINT NOT NULL REFERENCES rooms(room_id)
);

-- 8. Maintenance Requests
CREATE TABLE maintenance_requests (
    maintenance_id BIGSERIAL PRIMARY KEY,
    assigned_to VARCHAR(255),
    category VARCHAR(255),
    completed_date DATE,
    description VARCHAR(255),
    notes VARCHAR(255),
    priority VARCHAR(255) DEFAULT 'Medium',
    reported_date DATE,
    status VARCHAR(255) DEFAULT 'PENDING',
    room_id BIGINT REFERENCES rooms(room_id)
);

-- 9. Invoices
CREATE TABLE invoices (
    invoice_id BIGSERIAL PRIMARY KEY,
    amount DOUBLE PRECISION,
    due_date DATE,
    invoice_date DATE,
    invoice_number VARCHAR(255),
    notes VARCHAR(255),
    status VARCHAR(255) DEFAULT 'PENDING',
    tax DOUBLE PRECISION DEFAULT 0,
    total_amount DOUBLE PRECISION,
    reservation_id BIGINT REFERENCES reservations(reservation_id)
);

-- 10. Expenses
CREATE TABLE expenses (
    expense_id BIGSERIAL PRIMARY KEY,
    amount DOUBLE PRECISION,
    category VARCHAR(255),
    description VARCHAR(255),
    expense_date DATE,
    recorded_by VARCHAR(255),
    status VARCHAR(255) DEFAULT 'APPROVED'
);

-- 11. Notifications
CREATE TABLE notifications (
    notification_id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    message VARCHAR(255),
    related_entity VARCHAR(255),
    related_entity_id BIGINT,
    title VARCHAR(255),
    type VARCHAR(255),
    user_id BIGINT
);

-- 12. Audit Logs
CREATE TABLE audit_logs (
    audit_id BIGSERIAL PRIMARY KEY,
    action VARCHAR(255),
    description VARCHAR(255),
    entity_id BIGINT,
    entity_type VARCHAR(255),
    ip_address VARCHAR(255),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id VARCHAR(255),
    username VARCHAR(255)
);

-- ======================================================
-- SEED DATA
-- ======================================================

-- 1. Admins / Staff (passwords are bcrypt hashed)
-- Pattern: username + "123" e.g. admin/admin123
INSERT INTO admins (email, full_name, password, department, phone, position, role, status, username) VALUES
('admin@hasmirhotels.com', 'System Admin', '$2a$10$5QhMK6TMrdIUBk1NY7.6NOqUGti9zmOQHaia2hHNOVsgoZV3Vw2E6', 'Administration', '+255700000001', 'System Administrator', 'ADMIN', 'Active', 'admin'),
('manager@hasmirhotels.com', 'James Manager', '$2a$10$x6nhjD5tXCFb4a0bQM0ZzOaTMkPnW2pK7JlBZJqZ5omfpdRVN4dVy', 'Management', '+255700000002', 'Hotel Manager', 'MANAGER', 'Active', 'manager'),
('secretary@hasmirhotels.com', 'Sarah Secretary', '$2a$10$9uu3wvgu0LMfcq0nFI6fAer7lpqZBEMGEzEYchgnXwvnx3ItJCYCm', 'Front Desk', '+255700000003', 'Secretary', 'SECRETARY', 'Active', 'secretary'),
('housekeeper@hasmirhotels.com', 'Maria Housekeeper', '$2a$10$c4j7ETetnVuHY/u3A65XluYVa7eNFDLl7ZPWNkeXDjDNPRPVSemj.', 'Housekeeping', '+255700000004', 'Head Housekeeper', 'HOUSEKEEPER', 'Active', 'housekeeper'),
('accountant@hasmirhotels.com', 'David Accountant', '$2a$10$oN4eW6fBCWhQxeZSjnWGjuO91wKwKc97etLvWZcmjBWKnkbdnhwDO', 'Finance', '+255700000005', 'Accountant', 'ACCOUNTANT', 'Active', 'accountant'),
('maintenance@hasmirhotels.com', 'Peter Maintenance', '$2a$10$ZXSm24Fex7oZhqHCm1IP/ufaklcwQBYAOwgsKS/5m6QAp.LtXRTLi', 'Maintenance', '+255700000006', 'Maintenance Officer', 'MAINTENANCE', 'Active', 'maintenance'),
('linda.maintenance@hasmirhotels.com', 'Linda Maintenance', '$2a$10$.DLfnOSRMqErmpEz8eXqCOm0m.Nl.TBVMTRYhMZhF0pCMj5OdShhy', 'Maintenance', '+255700000007', 'Maintenance Staff', 'MAINTENANCE', 'Active', 'linda.maintenance');

-- 2. Rooms (20 rooms across 5 floors)
INSERT INTO rooms (room_number, room_type, floor, capacity, price_per_night, room_status) VALUES
-- Floor 1 - Standard Rooms
('101', 'Standard', 1, 2, 80.00, 'Available'),
('102', 'Standard', 1, 2, 80.00, 'Occupied'),
('103', 'Standard', 1, 2, 80.00, 'Available'),
('104', 'Standard', 1, 3, 95.00, 'Available'),
('105', 'Standard', 1, 2, 80.00, 'Maintenance'),
-- Floor 2 - Deluxe Rooms
('201', 'Deluxe', 2, 2, 150.00, 'Available'),
('202', 'Deluxe', 2, 2, 150.00, 'Occupied'),
('203', 'Deluxe', 2, 3, 180.00, 'Available'),
('204', 'Deluxe', 2, 2, 150.00, 'Available'),
('205', 'Deluxe', 2, 2, 150.00, 'Reserved'),
-- Floor 3 - Suite Rooms
('301', 'Suite', 3, 2, 250.00, 'Available'),
('302', 'Suite', 3, 3, 300.00, 'Occupied'),
('303', 'Suite', 3, 2, 250.00, 'Available'),
('304', 'Suite', 3, 4, 350.00, 'Available'),
('305', 'Suite', 3, 2, 250.00, 'Available'),
-- Floor 4 - Executive Suite
('401', 'Executive Suite', 4, 2, 400.00, 'Available'),
('402', 'Executive Suite', 4, 3, 450.00, 'Available'),
('403', 'Executive Suite', 4, 2, 400.00, 'Maintenance'),
('404', 'Presidential Suite', 4, 4, 600.00, 'Available'),
('405', 'Presidential Suite', 4, 2, 550.00, 'Available');

-- 3. Guests (20 guests)
INSERT INTO guests (first_name, last_name, gender, phone, email, nationality, address) VALUES
('John', 'Carter', 'Male', '+1234567890', 'john.carter@email.com', 'American', '123 Main St, New York'),
('Emma', 'Wilson', 'Female', '+1234567891', 'emma.wilson@email.com', 'British', '45 Oxford St, London'),
('Carlos', 'Rodriguez', 'Male', '+1234567892', 'carlos.rodriguez@email.com', 'Spanish', '78 Madrid Ave, Madrid'),
('Yuki', 'Tanaka', 'Female', '+1234567893', 'yuki.tanaka@email.com', 'Japanese', '12 Tokyo Blvd, Tokyo'),
('Ahmed', 'Hassan', 'Male', '+1234567894', 'ahmed.hassan@email.com', 'Egyptian', '34 Cairo Rd, Cairo'),
('Sophie', 'Dubois', 'Female', '+1234567895', 'sophie.dubois@email.com', 'French', '56 Paris St, Paris'),
('Lars', 'Andersen', 'Male', '+1234567896', 'lars.andersen@email.com', 'Norwegian', '89 Oslo Way, Oslo'),
('Priya', 'Sharma', 'Female', '+1234567897', 'priya.sharma@email.com', 'Indian', '23 Delhi Lane, New Delhi'),
('Marco', 'Rossi', 'Male', '+1234567898', 'marco.rossi@email.com', 'Italian', '45 Rome St, Rome'),
('Anna', 'Mueller', 'Female', '+1234567899', 'anna.mueller@email.com', 'German', '67 Berlin Ave, Berlin'),
('David', 'Kim', 'Male', '+1234567800', 'david.kim@email.com', 'Korean', '89 Seoul Rd, Seoul'),
('Maria', 'Santos', 'Female', '+1234567801', 'maria.santos@email.com', 'Brazilian', '12 Sao Paulo St, Sao Paulo'),
('Omar', 'Ali', 'Male', '+1234567802', 'omar.ali@email.com', 'Emirati', '34 Dubai Way, Dubai'),
('Chen', 'Wei', 'Male', '+1234567803', 'chen.wei@email.com', 'Chinese', '56 Beijing Rd, Beijing'),
('Isabella', 'Garcia', 'Female', '+1234567804', 'isabella.garcia@email.com', 'Colombian', '78 Bogota St, Bogota'),
('Ryan', 'O''Brien', 'Male', '+1234567805', 'ryan.obrien@email.com', 'Irish', '90 Dublin Ave, Dublin'),
('Fatima', 'Al-Rashid', 'Female', '+1234567806', 'fatima.alrashid@email.com', 'Saudi', '12 Riyadh Lane, Riyadh'),
('Thomas', 'Johansson', 'Male', '+1234567807', 'thomas.johansson@email.com', 'Swedish', '34 Stockholm Rd, Stockholm'),
('Olivia', 'Brown', 'Female', '+1234567808', 'olivia.brown@email.com', 'Australian', '56 Sydney St, Sydney'),
('Daniel', 'Nguyen', 'Male', '+1234567809', 'daniel.nguyen@email.com', 'Vietnamese', '78 Ho Chi Minh Way, Ho Chi Minh City');

-- 4. Reservations (32 reservations)
INSERT INTO reservations (guest_id, room_id, check_in_date, check_out_date, total_price, reservation_status) VALUES
-- Active/Current reservations (Checked-In)
(1, 2, '2026-08-25', '2026-09-01', 560.00, 'Checked-In'),
(2, 7, '2026-08-28', '2026-09-03', 900.00, 'Checked-In'),
(3, 12, '2026-08-30', '2026-09-05', 1800.00, 'Checked-In'),
-- Upcoming reservations (Reserved)
(4, 10, '2026-09-05', '2026-09-10', 750.00, 'Reserved'),
(5, 1, '2026-09-01', '2026-09-04', 240.00, 'Reserved'),
(6, 3, '2026-09-02', '2026-09-06', 320.00, 'Reserved'),
(7, 4, '2026-09-03', '2026-09-07', 380.00, 'Reserved'),
(8, 11, '2026-09-04', '2026-09-08', 1000.00, 'Reserved'),
(9, 13, '2026-09-05', '2026-09-10', 1250.00, 'Reserved'),
(10, 6, '2026-09-06', '2026-09-09', 450.00, 'Reserved'),
-- Past reservations (Checked-Out)
(11, 14, '2026-08-01', '2026-08-05', 1400.00, 'Checked-Out'),
(12, 15, '2026-08-03', '2026-08-07', 1000.00, 'Checked-Out'),
(13, 16, '2026-08-05', '2026-08-10', 2000.00, 'Checked-Out'),
(14, 17, '2026-08-07', '2026-08-12', 2250.00, 'Checked-Out'),
(15, 18, '2026-08-10', '2026-08-14', 1600.00, 'Checked-Out'),
(16, 19, '2026-08-12', '2026-08-15', 1350.00, 'Checked-Out'),
(17, 20, '2026-08-14', '2026-08-18', 2400.00, 'Checked-Out'),
(18, 8, '2026-08-15', '2026-08-19', 720.00, 'Checked-Out'),
(19, 9, '2026-08-18', '2026-08-22', 600.00, 'Checked-Out'),
(20, 1, '2026-08-20', '2026-08-24', 320.00, 'Checked-Out'),
(1, 3, '2026-07-01', '2026-07-05', 320.00, 'Checked-Out'),
(2, 6, '2026-07-05', '2026-07-10', 750.00, 'Checked-Out'),
(3, 11, '2026-07-10', '2026-07-15', 1250.00, 'Checked-Out'),
(4, 14, '2026-07-15', '2026-07-20', 1750.00, 'Checked-Out'),
(5, 16, '2026-07-20', '2026-07-25', 2000.00, 'Checked-Out'),
(6, 18, '2026-07-25', '2026-07-30', 1600.00, 'Checked-Out'),
-- Cancelled reservations
(7, 2, '2026-09-10', '2026-09-15', 400.00, 'Cancelled'),
(8, 7, '2026-09-12', '2026-09-16', 600.00, 'Cancelled'),
-- More future reservations
(9, 15, '2026-09-08', '2026-09-12', 1000.00, 'Reserved'),
(10, 20, '2026-09-10', '2026-09-15', 2750.00, 'Reserved'),
(11, 1, '2026-09-12', '2026-09-15', 240.00, 'Reserved'),
(12, 4, '2026-09-15', '2026-09-20', 475.00, 'Reserved');

-- 5. Payments
INSERT INTO payments (reservation_id, amount, payment_method, payment_date, payment_status) VALUES
(1, 560.00, 'Credit Card', '2026-08-25', 'Completed'),
(2, 900.00, 'Bank Transfer', '2026-08-28', 'Completed'),
(3, 1800.00, 'Cash', '2026-08-30', 'Completed'),
(11, 1400.00, 'Credit Card', '2026-08-01', 'Completed'),
(12, 1000.00, 'Debit Card', '2026-08-03', 'Completed'),
(13, 2000.00, 'Credit Card', '2026-08-05', 'Completed'),
(14, 2250.00, 'Bank Transfer', '2026-08-07', 'Completed'),
(15, 1600.00, 'Cash', '2026-08-10', 'Completed'),
(16, 1350.00, 'Credit Card', '2026-08-12', 'Completed'),
(17, 2400.00, 'Credit Card', '2026-08-14', 'Completed'),
(18, 720.00, 'Debit Card', '2026-08-15', 'Completed'),
(19, 600.00, 'Cash', '2026-08-18', 'Completed'),
(20, 320.00, 'Credit Card', '2026-08-20', 'Completed'),
(21, 320.00, 'Credit Card', '2026-07-01', 'Completed'),
(22, 750.00, 'Bank Transfer', '2026-07-05', 'Completed'),
(23, 1250.00, 'Credit Card', '2026-07-10', 'Completed'),
(24, 1750.00, 'Cash', '2026-07-15', 'Completed'),
(25, 2000.00, 'Credit Card', '2026-07-20', 'Completed'),
(26, 1600.00, 'Bank Transfer', '2026-07-25', 'Completed'),
(4, 375.00, 'Credit Card', '2026-09-05', 'Pending'),
(5, 240.00, 'Cash', '2026-09-01', 'Pending'),
(6, 320.00, 'Debit Card', '2026-09-02', 'Pending');

-- 6. Housekeeping
INSERT INTO housekeeping (room_id, assigned_staff, cleaning_status, cleaned_date) VALUES
(1, 'Maria Housekeeper', 'Completed', '2026-08-30'),
(2, 'Maria Housekeeper', 'In Progress', NULL),
(3, 'Linda Staff', 'Completed', '2026-08-29'),
(4, 'Linda Staff', 'Pending', NULL),
(5, 'Maria Housekeeper', 'Completed', '2026-08-28'),
(6, 'Linda Staff', 'Completed', '2026-08-30'),
(7, 'Maria Housekeeper', 'In Progress', NULL),
(8, 'Linda Staff', 'Completed', '2026-08-27'),
(9, 'Maria Housekeeper', 'Pending', NULL),
(10, 'Linda Staff', 'Completed', '2026-08-26'),
(11, 'Maria Housekeeper', 'Completed', '2026-08-25'),
(12, 'Linda Staff', 'In Progress', NULL),
(13, 'Maria Housekeeper', 'Pending', NULL),
(14, 'Linda Staff', 'Completed', '2026-08-24'),
(15, 'Maria Housekeeper', 'Completed', '2026-08-23'),
(16, 'Linda Staff', 'Completed', '2026-08-22'),
(17, 'Maria Housekeeper', 'Pending', NULL),
(18, 'Linda Staff', 'Completed', '2026-08-21'),
(19, 'Maria Housekeeper', 'Completed', '2026-08-20'),
(20, 'Linda Staff', 'Pending', NULL);

-- 7. Maintenance Requests
INSERT INTO maintenance_requests (room_id, description, priority, status, assigned_to, category, reported_date, completed_date, notes) VALUES
(5, 'Air conditioning not working', 'High', 'IN_PROGRESS', 'Peter Maintenance', 'HVAC', '2026-08-28', NULL, 'AC unit making strange noise'),
(18, 'Broken window in room', 'High', 'PENDING', 'Peter Maintenance', 'Structural', '2026-08-30', NULL, 'Window on 3rd floor cracked'),
(8, 'Leaky faucet in bathroom', 'Medium', 'COMPLETED', 'Linda Maintenance', 'Plumbing', '2026-08-20', '2026-08-22', 'Fixed washer'),
(12, 'TV remote not working', 'Low', 'COMPLETED', 'Peter Maintenance', 'Electronics', '2026-08-15', '2026-08-16', 'Replaced batteries'),
(3, 'Carpet stain needs cleaning', 'Low', 'PENDING', 'Linda Maintenance', 'Cleaning', '2026-08-29', NULL, 'Red wine stain on carpet'),
(15, 'Door lock jamming', 'High', 'IN_PROGRESS', 'Peter Maintenance', 'Security', '2026-08-27', NULL, 'Key card reader malfunction'),
(7, 'Water pressure low', 'Medium', 'PENDING', 'Linda Maintenance', 'Plumbing', '2026-08-30', NULL, 'Shower pressure decreased'),
(19, 'Electrical outlet not working', 'High', 'COMPLETED', 'Peter Maintenance', 'Electrical', '2026-08-18', '2026-08-19', 'Replaced outlet'),
(20, 'Minibar not cooling', 'Medium', 'PENDING', 'Linda Maintenance', 'Appliances', '2026-08-31', NULL, 'Minibar temperature too warm'),
(14, 'Curtains torn', 'Low', 'PENDING', 'Peter Maintenance', 'Furnishing', '2026-08-30', NULL, 'Need to replace curtain fabric');

-- 8. Invoices
INSERT INTO invoices (reservation_id, invoice_number, amount, tax, total_amount, status, invoice_date, due_date, notes) VALUES
(1, 'INV-2026-001', 560.00, 56.00, 616.00, 'PAID', '2026-08-25', '2026-09-01', 'Room 102 - Deluxe'),
(2, 'INV-2026-002', 900.00, 90.00, 990.00, 'PAID', '2026-08-28', '2026-09-03', 'Room 202 - Deluxe'),
(3, 'INV-2026-003', 1800.00, 180.00, 1980.00, 'PAID', '2026-08-30', '2026-09-05', 'Room 302 - Suite'),
(11, 'INV-2026-004', 1400.00, 140.00, 1540.00, 'PAID', '2026-08-01', '2026-08-05', 'Room 304 - Suite'),
(12, 'INV-2026-005', 1000.00, 100.00, 1100.00, 'PAID', '2026-08-03', '2026-08-07', 'Room 305 - Suite'),
(13, 'INV-2026-006', 2000.00, 200.00, 2200.00, 'PAID', '2026-08-05', '2026-08-10', 'Room 401 - Executive'),
(4, 'INV-2026-007', 750.00, 75.00, 825.00, 'PENDING', '2026-09-05', '2026-09-10', 'Room 205 - Deluxe'),
(5, 'INV-2026-008', 240.00, 24.00, 264.00, 'PENDING', '2026-09-01', '2026-09-04', 'Room 101 - Standard'),
(6, 'INV-2026-009', 320.00, 32.00, 352.00, 'PENDING', '2026-09-02', '2026-09-06', 'Room 103 - Standard');

-- 9. Expenses
INSERT INTO expenses (category, description, amount, expense_date, recorded_by, status) VALUES
('Utilities', 'Monthly electricity bill', 3500.00, '2026-08-01', 'David Accountant', 'APPROVED'),
('Utilities', 'Water and sewage bill', 1200.00, '2026-08-01', 'David Accountant', 'APPROVED'),
('Maintenance', 'AC repair parts', 850.00, '2026-08-15', 'David Accountant', 'APPROVED'),
('Supplies', 'Cleaning supplies bulk order', 650.00, '2026-08-20', 'David Accountant', 'APPROVED'),
('Staff', 'Overtime pay - housekeeping', 1200.00, '2026-08-25', 'David Accountant', 'APPROVED'),
('Marketing', 'Online advertising campaign', 2000.00, '2026-08-10', 'David Accountant', 'APPROVED'),
('Furniture', 'New curtains for rooms 304-305', 450.00, '2026-08-22', 'David Accountant', 'PENDING'),
('Technology', 'WiFi router upgrade', 1800.00, '2026-08-18', 'David Accountant', 'APPROVED'),
('Insurance', 'Monthly property insurance', 2500.00, '2026-08-01', 'David Accountant', 'APPROVED'),
('Food', 'Restaurant supplies', 3200.00, '2026-08-05', 'David Accountant', 'APPROVED');

-- 10. Notifications
INSERT INTO notifications (user_id, title, message, type, is_read, created_at, related_entity, related_entity_id) VALUES
(1, 'New Reservation', 'New reservation from John Carter for Room 102', 'RESERVATION', false, '2026-08-25 10:00:00', 'reservation', 1),
(1, 'Payment Received', 'Payment of $560 received for reservation #1', 'PAYMENT', true, '2026-08-25 10:30:00', 'payment', 1),
(1, 'Check-in Completed', 'John Carter checked into Room 102', 'CHECKIN', true, '2026-08-25 14:00:00', 'reservation', 1),
(2, 'Maintenance Alert', 'AC not working in Room 105 - High Priority', 'MAINTENANCE', false, '2026-08-28 09:00:00', 'maintenance', 1),
(3, 'New Guest Registration', 'New guest Emma Wilson registered', 'GUEST', false, '2026-08-28 08:00:00', 'guest', 2),
(4, 'Room Cleaning', 'Room 101 needs cleaning - Completed', 'HOUSEKEEPING', true, '2026-08-30 07:00:00', 'housekeeping', 1),
(1, 'Cancellation', 'Reservation #27 cancelled by Lars Andersen', 'CANCELLATION', false, '2026-08-30 11:00:00', 'reservation', 27),
(2, 'Low Water Pressure', 'Report of low water pressure in Room 202', 'MAINTENANCE', false, '2026-08-30 15:00:00', 'maintenance', 7),
(5, 'Invoice Overdue', 'Invoice INV-2026-004 is past due', 'INVOICE', false, '2026-08-31 09:00:00', 'invoice', 4),
(6, 'Maintenance Request', 'Door lock jamming in Room 302', 'MAINTENANCE', false, '2026-08-27 10:00:00', 'maintenance', 6),
(1, 'Revenue Alert', 'Monthly revenue exceeded target by 15%', 'INFO', true, '2026-08-31 08:00:00', NULL, NULL),
(2, 'Staff Schedule', 'Housekeeping schedule updated for September', 'INFO', false, '2026-08-30 16:00:00', NULL, NULL),
(3, 'Guest Complaint', 'Guest in Room 302 reported noise issue', 'COMPLAINT', false, '2026-08-30 20:00:00', 'reservation', 3),
(4, 'Supply Alert', 'Cleaning supplies running low - reorder needed', 'SUPPLY', false, '2026-08-29 11:00:00', NULL, NULL),
(5, 'Budget Review', 'Q3 budget review meeting scheduled', 'INFO', true, '2026-08-28 14:00:00', NULL, NULL);

-- 11. Audit Logs
INSERT INTO audit_logs (username, action, description, entity_type, entity_id, ip_address, timestamp) VALUES
('admin', 'LOGIN', 'Admin logged in', 'AUTH', 1, '192.168.1.100', '2026-08-25 08:00:00'),
('admin', 'CREATE', 'Created room 405 - Presidential Suite', 'ROOM', 20, '192.168.1.100', '2026-08-25 08:15:00'),
('secretary', 'LOGIN', 'Secretary logged in', 'AUTH', 3, '192.168.1.101', '2026-08-25 08:30:00'),
('secretary', 'CREATE', 'Created reservation #1 for John Carter', 'RESERVATION', 1, '192.168.1.101', '2026-08-25 10:00:00'),
('secretary', 'UPDATE', 'Checked in reservation #1', 'RESERVATION', 1, '192.168.1.101', '2026-08-25 14:00:00'),
('manager', 'LOGIN', 'Manager logged in', 'AUTH', 2, '192.168.1.102', '2026-08-26 09:00:00'),
('manager', 'UPDATE', 'Updated room rates for Q3', 'ROOM', NULL, '192.168.1.102', '2026-08-26 09:30:00'),
('admin', 'UPDATE', 'Updated admin profile settings', 'ADMIN', 1, '192.168.1.100', '2026-08-27 10:00:00'),
('maintenance', 'LOGIN', 'Maintenance staff logged in', 'AUTH', 6, '192.168.1.103', '2026-08-28 07:30:00'),
('maintenance', 'UPDATE', 'Completed maintenance request #3 - Leaky faucet', 'MAINTENANCE', 3, '192.168.1.103', '2026-08-28 11:00:00'),
('admin', 'CREATE', 'Created expense record - electricity bill', 'EXPENSE', 1, '192.168.1.100', '2026-08-01 09:00:00'),
('accountant', 'LOGIN', 'Accountant logged in', 'AUTH', 5, '192.168.1.104', '2026-08-01 08:30:00'),
('accountant', 'CREATE', 'Generated invoice INV-2026-001', 'INVOICE', 1, '192.168.1.104', '2026-08-25 10:30:00'),
('housekeeper', 'LOGIN', 'Housekeeper logged in', 'AUTH', 4, '192.168.1.105', '2026-08-25 06:30:00'),
('housekeeper', 'UPDATE', 'Completed cleaning for Room 101', 'HOUSEKEEPING', 1, '192.168.1.105', '2026-08-30 07:00:00');

-- ======================================================
-- RESET SEQUENCES
-- ======================================================
SELECT setval('admins_id_seq', (SELECT MAX(id) FROM admins));
SELECT setval('guests_guest_id_seq', (SELECT MAX(guest_id) FROM guests));
SELECT setval('rooms_room_id_seq', (SELECT MAX(room_id) FROM rooms));
SELECT setval('reservations_reservation_id_seq', (SELECT MAX(reservation_id) FROM reservations));
SELECT setval('payments_payment_id_seq', (SELECT MAX(payment_id) FROM payments));
SELECT setval('housekeeping_housekeeping_id_seq', (SELECT MAX(housekeeping_id) FROM housekeeping));
SELECT setval('maintenance_requests_maintenance_id_seq', (SELECT MAX(maintenance_id) FROM maintenance_requests));
SELECT setval('invoices_invoice_id_seq', (SELECT MAX(invoice_id) FROM invoices));
SELECT setval('expenses_expense_id_seq', (SELECT MAX(expense_id) FROM expenses));
SELECT setval('notifications_notification_id_seq', (SELECT MAX(notification_id) FROM notifications));
SELECT setval('audit_logs_audit_id_seq', (SELECT MAX(audit_id) FROM audit_logs));

-- ======================================================
-- VERIFICATION
-- ======================================================
SELECT 'admins' as table_name, COUNT(*) as rows FROM admins UNION ALL
SELECT 'guest_users', COUNT(*) FROM guest_users UNION ALL
SELECT 'guests', COUNT(*) FROM guests UNION ALL
SELECT 'rooms', COUNT(*) FROM rooms UNION ALL
SELECT 'reservations', COUNT(*) FROM reservations UNION ALL
SELECT 'payments', COUNT(*) FROM payments UNION ALL
SELECT 'housekeeping', COUNT(*) FROM housekeeping UNION ALL
SELECT 'maintenance_requests', COUNT(*) FROM maintenance_requests UNION ALL
SELECT 'invoices', COUNT(*) FROM invoices UNION ALL
SELECT 'expenses', COUNT(*) FROM expenses UNION ALL
SELECT 'notifications', COUNT(*) FROM notifications UNION ALL
SELECT 'audit_logs', COUNT(*) FROM audit_logs;
