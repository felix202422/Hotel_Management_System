-- Admin
INSERT INTO admins (full_name, email, password, username, role) VALUES
('Admin Hasmir', 'admin@hasmirhotels.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'admin', 'ADMIN');
-- Default password is 'admin123' (BCrypt encoded)

-- Rooms (30 rooms across 5 floors)
INSERT INTO rooms (room_number, room_type, floor, capacity, price_per_night, room_status) VALUES
('101', 'Deluxe Suite', 1, 2, 250.00, 'Available'),
('102', 'Deluxe Suite', 1, 2, 250.00, 'Reserved'),
('103', 'Executive Suite', 1, 3, 350.00, 'Occupied'),
('104', 'Standard Room', 1, 2, 150.00, 'Available'),
('105', 'Standard Room', 1, 2, 150.00, 'Maintenance'),
('201', 'Deluxe Suite', 2, 2, 260.00, 'Available'),
('202', 'Executive Suite', 2, 3, 360.00, 'Reserved'),
('203', 'Standard Room', 2, 2, 160.00, 'Available'),
('204', 'Standard Room', 2, 2, 160.00, 'Occupied'),
('205', 'Deluxe Suite', 2, 2, 260.00, 'Available'),
('301', 'Presidential Suite', 3, 4, 500.00, 'Available'),
('302', 'Presidential Suite', 3, 4, 500.00, 'Reserved'),
('303', 'Executive Suite', 3, 3, 370.00, 'Available'),
('304', 'Executive Suite', 3, 3, 370.00, 'Occupied'),
('305', 'Standard Room', 3, 2, 170.00, 'Available'),
('401', 'Deluxe Suite', 4, 2, 280.00, 'Reserved'),
('402', 'Deluxe Suite', 4, 2, 280.00, 'Available'),
('403', 'Standard Room', 4, 2, 180.00, 'Occupied'),
('404', 'Standard Room', 4, 2, 180.00, 'Available'),
('405', 'Executive Suite', 4, 3, 390.00, 'Available'),
('501', 'Penthouse Suite', 5, 6, 800.00, 'Available'),
('502', 'Penthouse Suite', 5, 6, 800.00, 'Reserved'),
('503', 'Presidential Suite', 5, 4, 550.00, 'Occupied'),
('504', 'Executive Suite', 5, 3, 400.00, 'Available'),
('505', 'Deluxe Suite', 5, 2, 300.00, 'Available');

-- Guests
INSERT INTO guests (first_name, last_name, gender, phone, email, nationality, address) VALUES
('John', 'Carter', 'Male', '+1-555-0101', 'john.carter@email.com', 'American', '123 Park Avenue, New York, USA'),
('Emily', 'Brown', 'Female', '+1-555-0102', 'emily.brown@email.com', 'Canadian', '456 Maple Street, Toronto, Canada'),
('Sophia', 'Miller', 'Female', '+44-555-0103', 'sophia.miller@email.com', 'British', '78 Oxford Street, London, UK'),
('David', 'Wilson', 'Male', '+61-555-0104', 'david.wilson@email.com', 'Australian', '90 Harbour Road, Sydney, Australia'),
('Grace', 'Johnson', 'Female', '+1-555-0105', 'grace.johnson@email.com', 'American', '234 Sunset Blvd, Los Angeles, USA'),
('Michael', 'Davis', 'Male', '+49-555-0106', 'michael.davis@email.com', 'German', '12 Hauptstrasse, Berlin, Germany'),
('Sarah', 'Taylor', 'Female', '+33-555-0107', 'sarah.taylor@email.com', 'French', '45 Rue de Rivoli, Paris, France'),
('James', 'Anderson', 'Male', '+81-555-0108', 'james.anderson@email.com', 'Japanese', '6-12 Ginza, Tokyo, Japan'),
('Olivia', 'Thomas', 'Female', '+1-555-0109', 'olivia.thomas@email.com', 'American', '567 Michigan Ave, Chicago, USA'),
('William', 'Jackson', 'Male', '+55-555-0110', 'william.jackson@email.com', 'Brazilian', '89 Avenida Paulista, Sao Paulo, Brazil');

-- Reservations
INSERT INTO reservations (guest_id, room_id, check_in_date, check_out_date, total_price, reservation_status) VALUES
(1, 2, '2024-12-01', '2024-12-05', 1000.00, 'Checked-Out'),
(2, 7, '2024-12-03', '2024-12-07', 1440.00, 'Checked-Out'),
(3, 12, '2024-12-05', '2024-12-08', 1500.00, 'Checked-In'),
(4, 17, '2024-12-06', '2024-12-10', 1120.00, 'Checked-In'),
(5, 3, '2024-12-10', '2024-12-12', 700.00, 'Reserved'),
(6, 22, '2024-12-11', '2024-12-15', 3200.00, 'Reserved'),
(7, 10, '2024-12-12', '2024-12-14', 520.00, 'Cancelled'),
(8, 5, '2024-12-13', '2024-12-16', 450.00, 'Reserved'),
(9, 14, '2024-12-14', '2024-12-18', 1480.00, 'Reserved'),
(10, 19, '2024-12-15', '2024-12-17', 360.00, 'Checked-In'),
(1, 25, '2024-12-16', '2024-12-20', 1200.00, 'Reserved'),
(2, 8, '2024-12-17', '2024-12-19', 320.00, 'Checked-In');

-- Payments
INSERT INTO payments (reservation_id, payment_method, payment_date, amount, payment_status) VALUES
(1, 'Credit Card', '2024-12-01', 1000.00, 'Completed'),
(2, 'Debit Card', '2024-12-03', 1440.00, 'Completed'),
(3, 'Credit Card', '2024-12-05', 1500.00, 'Completed'),
(4, 'Bank Transfer', '2024-12-06', 1120.00, 'Completed'),
(5, 'Credit Card', '2024-12-10', 700.00, 'Pending'),
(6, 'Bank Transfer', '2024-12-11', 3200.00, 'Pending'),
(7, 'Credit Card', '2024-12-12', 520.00, 'Refunded'),
(8, 'Debit Card', '2024-12-13', 450.00, 'Pending'),
(9, 'Credit Card', '2024-12-14', 1480.00, 'Pending'),
(10, 'Cash', '2024-12-15', 360.00, 'Completed'),
(11, 'Credit Card', '2024-12-16', 1200.00, 'Pending'),
(12, 'Debit Card', '2024-12-17', 320.00, 'Completed');

-- Housekeeping
INSERT INTO housekeeping (room_id, assigned_staff, cleaning_status, cleaned_date) VALUES
(1, 'Maria Santos', 'Completed', '2024-12-01'),
(2, 'John Smith', 'Completed', '2024-12-02'),
(3, 'Maria Santos', 'Completed', '2024-12-03'),
(4, 'David Lee', 'In Progress', '2024-12-04'),
(5, 'Anna Kowalski', 'Pending', NULL),
(6, 'John Smith', 'Completed', '2024-12-01'),
(7, 'Maria Santos', 'Completed', '2024-12-02'),
(8, 'David Lee', 'Pending', NULL),
(9, 'Anna Kowalski', 'In Progress', '2024-12-03'),
(10, 'John Smith', 'Completed', '2024-12-04'),
(11, 'Maria Santos', 'Pending', NULL),
(12, 'David Lee', 'Completed', '2024-12-05'),
(13, 'Anna Kowalski', 'Completed', '2024-12-06'),
(14, 'John Smith', 'In Progress', '2024-12-07'),
(15, 'Maria Santos', 'Pending', NULL);
