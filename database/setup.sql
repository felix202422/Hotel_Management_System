-- =============================================
-- FIZZO HOTELS - Database Setup Script
-- PostgreSQL Database Creation
-- =============================================

-- Run this script in pgAdmin or psql
CREATE DATABASE fizzo_hotels_db;

-- The tables below are auto-created by Spring Boot JPA (ddl-auto=update)
-- But here is the schema reference:

-- Entities:
-- users (parent - abstract)
-- admins (extends users)
-- rooms
-- guests
-- reservations
-- payments
-- housekeeping

-- Default admin credentials:
-- Email:    admin@fizzohotels.com
-- Password: admin123

-- Sample data is auto-loaded via DataInitializer.java on first run.
