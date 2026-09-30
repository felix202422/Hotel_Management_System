-- ============================================================
-- Fizzo Hotels Reservation & Management System
-- Seed / Sample Data
-- ============================================================

-- ============================================================
-- ADMIN
-- ============================================================
INSERT INTO admin (full_name, email, password, username, role)
VALUES (
    'System Admin',
    'admin@fizzohotels.com',
    '$2a$10$PlaceholderBcryptHashForAdminPassword1234567890ABCDEF',
    'admin',
    'ADMIN'
);

-- ============================================================
-- ROOMS (10)
-- ============================================================
INSERT INTO room (room_number, room_type, floor, capacity, price_per_night, room_status) VALUES
('101', 'Deluxe Suite', 1, 2, 150.00, 'Available'),
('102', 'Deluxe Suite', 1, 2, 180.00, 'Available'),
('103', 'Deluxe Suite', 1, 3, 200.00, 'Available'),
('104', 'Deluxe Suite', 1, 2, 160.00, 'Reserved'),
('105', 'Deluxe Suite', 1, 3, 190.00, 'Occupied'),
('201', 'Executive Suite', 2, 2, 250.00, 'Available'),
('202', 'Executive Suite', 2, 2, 280.00, 'Occupied'),
('203', 'Executive Suite', 2, 3, 320.00, 'Maintenance'),
('204', 'Executive Suite', 2, 4, 350.00, 'Available'),
('301', 'Presidential Suite', 3, 4, 500.00, 'Available');

-- ============================================================
-- GUESTS (5)
-- ============================================================
INSERT INTO guest (first_name, last_name, gender, phone, email, nationality, address) VALUES
('John',    'Carter', 'Male',   '+1-555-0101', 'john.carter@email.com',   'American',   '123 Main St, New York, USA'),
('Emily',   'Brown',  'Female', '+44-555-0202', 'emily.brown@email.com',   'British',    '45 Oxford St, London, UK'),
('Sophia',  'Miller', 'Female', '+1-555-0303', 'sophia.miller@email.com', 'Canadian',   '78 Maple Ave, Toronto, Canada'),
('David',   'Wilson', 'Male',   '+61-555-0404', 'david.wilson@email.com',  'Australian', '12 Harbour Rd, Sydney, Australia'),
('Grace',   'Johnson','Female', '+353-555-0505','grace.johnson@email.com', 'Irish',      '56 Green Rd, Dublin, Ireland');

-- ============================================================
-- RESERVATIONS (8)
-- ============================================================
INSERT INTO reservation (guest_id, room_id, check_in_date, check_out_date, total_price, reservation_status) VALUES
-- John Carter in 101 (Deluxe, $150/night) - checked in and out
(1, 1, '2026-01-10', '2026-01-15', 750.00,  'Checked Out'),
-- Emily Brown in 102 (Deluxe, $180/night) - cancelled
(2, 2, '2026-02-05', '2026-02-08', 540.00,  'Cancelled'),
-- Sophia Miller in 103 (Deluxe, $200/night) - checked in
(3, 3, '2026-03-01', '2026-03-05', 800.00,  'Checked In'),
-- David Wilson in 201 (Executive, $250/night) - pending
(4, 6, '2026-04-10', '2026-04-14', 1000.00, 'Pending'),
-- Grace Johnson in 204 (Executive, $350/night) - confirmed
(5, 9, '2026-05-01', '2026-05-07', 2100.00, 'Confirmed'),
-- John Carter in 301 (Presidential, $500/night) - checked in
(1, 10,'2026-06-15', '2026-06-20', 2500.00, 'Checked In'),
-- Emily Brown in 104 (Deluxe, $160/night) - pending
(2, 4, '2026-07-01', '2026-07-03', 320.00,  'Pending'),
-- Sophia Miller in 202 (Executive, $280/night) - confirmed
(3, 7, '2026-08-10', '2026-08-14', 1120.00, 'Confirmed');

-- ============================================================
-- PAYMENTS (8 — matching each reservation)
-- ============================================================
INSERT INTO payment (reservation_id, payment_method, payment_date, amount, payment_status) VALUES
(1, 'Credit Card', '2026-01-10', 750.00,  'Paid'),
(2, 'PayPal',      '2026-02-05', 540.00,  'Refunded'),
(3, 'Credit Card', '2026-03-01', 800.00,  'Paid'),
(4, 'Bank Transfer','2026-04-10',1000.00, 'Pending'),
(5, 'Credit Card', '2026-04-25', 2100.00, 'Paid'),
(6, 'Debit Card',  '2026-06-15', 2500.00, 'Paid'),
(7, 'PayPal',      '2026-07-01', 320.00,  'Pending'),
(8, 'Bank Transfer','2026-08-01', 1120.00, 'Paid');

-- ============================================================
-- HOUSEKEEPING (5)
-- ============================================================
INSERT INTO housekeeping (room_id, assigned_staff, cleaning_status, cleaned_date) VALUES
(1,  'Maria Santos', 'Completed', '2026-01-15'),
(3,  'James Okafor', 'In Progress', NULL),
(5,  'Li Wei',       'Completed', '2026-03-10'),
(6,  'Maria Santos', 'Pending',    NULL),
(10, 'James Okafor', 'Completed', '2026-06-20');
