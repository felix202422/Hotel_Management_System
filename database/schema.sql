-- FIZZO HOTELS Reservation & Management System
-- PostgreSQL Database Schema

-- Create Database
CREATE DATABASE fizzo_hotels_db;

-- Connect to database
\c fizzo_hotels_db;

-- Users Table (Parent)
CREATE TABLE IF NOT EXISTS admins (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(50) NOT NULL DEFAULT 'ADMIN'
);

-- Rooms Table
CREATE TABLE IF NOT EXISTS rooms (
    room_id BIGSERIAL PRIMARY KEY,
    room_number VARCHAR(50) NOT NULL UNIQUE,
    room_type VARCHAR(100) NOT NULL,
    floor INTEGER NOT NULL,
    capacity INTEGER NOT NULL,
    price_per_night DOUBLE PRECISION NOT NULL,
    room_status VARCHAR(50) NOT NULL DEFAULT 'Available'
);

-- Guests Table
CREATE TABLE IF NOT EXISTS guests (
    guest_id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    gender VARCHAR(20),
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    nationality VARCHAR(100),
    address TEXT
);

-- Reservations Table
CREATE TABLE IF NOT EXISTS reservations (
    reservation_id BIGSERIAL PRIMARY KEY,
    guest_id BIGINT NOT NULL,
    room_id BIGINT NOT NULL,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    total_price DOUBLE PRECISION NOT NULL,
    reservation_status VARCHAR(50) NOT NULL DEFAULT 'Reserved',
    CONSTRAINT fk_reservation_guest FOREIGN KEY (guest_id) REFERENCES guests(guest_id) ON DELETE CASCADE,
    CONSTRAINT fk_reservation_room FOREIGN KEY (room_id) REFERENCES rooms(room_id) ON DELETE CASCADE
);

-- Payments Table
CREATE TABLE IF NOT EXISTS payments (
    payment_id BIGSERIAL PRIMARY KEY,
    reservation_id BIGINT NOT NULL UNIQUE,
    payment_method VARCHAR(100) NOT NULL,
    payment_date DATE NOT NULL,
    amount DOUBLE PRECISION NOT NULL,
    payment_status VARCHAR(50) NOT NULL DEFAULT 'Pending',
    CONSTRAINT fk_payment_reservation FOREIGN KEY (reservation_id) REFERENCES reservations(reservation_id) ON DELETE CASCADE
);

-- Housekeeping Table
CREATE TABLE IF NOT EXISTS housekeeping (
    housekeeping_id BIGSERIAL PRIMARY KEY,
    room_id BIGINT NOT NULL,
    assigned_staff VARCHAR(255) NOT NULL,
    cleaning_status VARCHAR(50) NOT NULL DEFAULT 'Pending',
    cleaned_date DATE,
    CONSTRAINT fk_housekeeping_room FOREIGN KEY (room_id) REFERENCES rooms(room_id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX idx_rooms_status ON rooms(room_status);
CREATE INDEX idx_rooms_type ON rooms(room_type);
CREATE INDEX idx_guests_email ON guests(email);
CREATE INDEX idx_reservations_status ON reservations(reservation_status);
CREATE INDEX idx_reservations_dates ON reservations(check_in_date, check_out_date);
CREATE INDEX idx_payments_status ON payments(payment_status);
CREATE INDEX idx_housekeeping_status ON housekeeping(cleaning_status);
