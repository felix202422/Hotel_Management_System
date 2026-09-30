# Fizzo Hotels Reservation & Management System

[![CI](https://github.com/felix202422/Hotel_Management_System/actions/workflows/ci.yml/badge.svg)](https://github.com/felix202422/Hotel_Management_System/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
![Java](https://img.shields.io/badge/Java-25-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.1-brightgreen)
![React](https://img.shields.io/badge/React-19-61dafb)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18-336791)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED)

A full-stack hotel reservation and management system built with React 19, Spring Boot 4.1, and PostgreSQL 18 — with a public visitor site, a guest portal, and role-specific dashboards for five staff roles.

## Tech Stack

- **Frontend:** React 19.3, React Router 7, Axios 1.x, Recharts 3, Lucide Icons, Vite 8 (ES2023+)
- **Backend:** Java 25 LTS, Spring Boot 4.1.1 (Web MVC, Data JPA, Security 7, Validation)
- **Database:** PostgreSQL 18
- **Authentication:** JWT (stateless, Bearer tokens)
- **Development:** IntelliJ IDEA / VS Code, Git & GitHub, Postman, Docker & Docker Compose

## Features

- Public visitor site: home, room browsing, services, about, contact, booking lookup
- Guest portal: self-registration, dashboard, booking, profile
- Role-based staff workspaces: Admin, Manager, Secretary, Housekeeping, Accountant, Maintenance
- Room, guest, reservation, payment, housekeeping, maintenance, invoice, and expense management
- Dashboard analytics, reports, notifications, and an admin audit log
- JWT authentication with role-based API authorization

## Roles

| Role | Workspace | Scope |
|------|-----------|-------|
| ADMIN | `/admin` | Full access, user & staff management, audit log, settings |
| MANAGER | `/manager` | Read oversight of all operations; manages staff |
| SECRETARY | `/secretary` | Reservations, check-in/out, guests, payments |
| HOUSEKEEPING_STAFF | `/housekeeping` | Room cleaning tasks and status |
| ACCOUNTANT | `/accountant` | Payments, invoices, expenses, revenue, reports |
| MAINTENANCE_STAFF | `/maintenance` | Maintenance requests and tasks |
| GUEST | `/guest` | Personal dashboard and booking |

## Prerequisites

- Node.js 20.19+ (22 LTS recommended)
- JDK 25 (Java 17+ works; the project targets 25)
- Maven 3.9.x
- PostgreSQL 18
- Docker & Docker Compose (optional, for containerized setup)

## Quick Start with Docker

The fastest way to run the whole stack — PostgreSQL 18, backend, and frontend:

```bash
# 1. Create .env with your secrets
cat > .env <<'EOF'
DB_USERNAME=postgres
DB_PASSWORD=your-secret
JWT_SECRET=replace-with-a-long-random-secret-at-least-32-chars
EOF

# 2. Build and start everything
docker compose up --build
```

- Frontend: http://localhost:5173 (nginx, proxies /api to the backend)
- Backend API: http://localhost:8081
- PostgreSQL 18: localhost:5432 (persisted in the `pgdata` volume)

## Database Setup

1. Install PostgreSQL
2. Create the database: `fizzo_hotels_db`
3. Run `database/schema.sql` and `database/seed.sql` (optional — the backend also seeds demo data on first startup)
4. Configure credentials via environment variables (see **Backend Configuration** below)

Default admin credentials after seeding: username `admin`, password `admin123`.
Other demo accounts: `manager` / `manager123`, `secretary` / `secretary123`, `housekeeper` / `housekeeper123`, `accountant` / `accountant123`, `maintenance` / `maintenance123`.

> The backend creates and seeds its own schema via Hibernate (`ddl-auto=update`) and a startup seeder, so steps 3–4 are optional.

## Backend Configuration

Secrets are read from environment variables — nothing sensitive is committed. The backend loads `backend/.env` (gitignored) automatically on startup.

```bash
cd backend
cp .env.example .env   # then edit .env with your real values
```

| Variable | Purpose | Notes |
|----------|---------|-------|
| `DB_URL` | PostgreSQL JDBC URL | default `jdbc:postgresql://localhost:5432/fizzo_hotels_db` |
| `DB_USERNAME` | Database user | default `postgres` |
| `DB_PASSWORD` | Database password | **required** — no default |
| `JWT_SECRET` | JWT signing key | **required** — 32+ chars for HS256 (`openssl rand -base64 48`) |
| `JWT_EXPIRATION_MS` | Token lifetime | default 24h |
| `LOG_LEVEL` | App log level | default `DEBUG` |
| `JPA_DDL_AUTO` | Hibernate schema mode | set `validate`/`none` in production |
| `JPA_SHOW_SQL` | SQL logging | set `false` in production |

All variables can also be set as real environment variables or JVM args (`-DDB_PASSWORD=...`), which takes precedence over `.env` — use that for staging/production deployments.

## Backend Setup

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

The backend runs on **http://localhost:8081** (override via `SERVER_PORT` in `.env`). See `postman/` for a ready-made API collection.

> On first boot the app fails fast with a clear message if `DB_PASSWORD` or `JWT_SECRET` are missing.

> On first boot the app fails fast with a clear message if `DB_PASSWORD` or `JWT_SECRET` are missing.

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on **http://localhost:5173**. A dev proxy forwards `/api/*` requests to `http://localhost:8081` (see `frontend/vite.config.js`).

## User Manual

1. Browse rooms publicly at `/` (visitor site), or log in at `/login`
2. Each role lands on its own dashboard after login
3. Use the sidebar to navigate within a workspace
4. Secretaries create reservations and process check-in/check-out; accountants handle payments, invoices, and expenses
5. Generate reports from the Reports pages
6. Guests can register, book, and track bookings; visitors can look up a booking by reference

## API Overview

Base URL: `http://localhost:8081/api` — all responses use a common envelope: `{ "success": bool, "message": string, "data": ... }`.

All list endpoints support `?page=&size=&sortBy=&sortDir=&search=` pagination (paginated payloads return `{ content, totalElements, totalPages, ... }`).

### Authentication (public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Staff/admin login → JWT + profile |
| POST | `/api/guest-auth/register` | Guest self-registration |
| POST | `/api/guest-auth/login` | Guest login |
| GET | `/api/rooms` | Public room browsing |
| GET | `/api/reservations/track/{ref}` | Public booking lookup by reference (`BK-` prefix optional) |
| POST | `/api/contact` | Visitor contact form submission |

### Self-service (any authenticated staff user)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/auth/me` | Current authenticated user |
| PUT | `/api/auth/me` | Update own profile (name, email, phone) |
| PUT | `/api/auth/me/password` | Change own password (requires current password) |
| POST | `/api/auth/register` | Create user (ADMIN only) |
| GET | `/api/auth/users` | List users (ADMIN only) |
| PUT | `/api/auth/users/{id}` | Update user (ADMIN only) |
| PUT | `/api/auth/users/{id}/status` | Enable/disable user (ADMIN only) |

### Core resources
| Method | Endpoint | Notes |
|--------|----------|-------|
| GET/POST | `/api/rooms` | GET public; create ADMIN/MANAGER |
| GET/PUT/DELETE | `/api/rooms/{id}` | Updates also by SECRETARY (check-in/out) |
| GET | `/api/rooms/status/{status}` | Filter by room status |
| GET/POST/PUT/DELETE | `/api/guests`, `/api/guests/{id}` | ADMIN/MANAGER/SECRETARY |
| GET/POST/PUT/DELETE | `/api/reservations`, `/api/reservations/{id}` | ADMIN/MANAGER/SECRETARY |
| PUT | `/api/reservations/{id}/checkin` \| `/checkout` \| `/approve` \| `/cancel` | Workflow transitions |
| GET | `/api/reservations/status/{status}` | Filter by reservation status |
| GET | `/api/reservations/checkins/today` \| `/checkouts/today` | Front-desk views |
| GET/POST/PUT/DELETE | `/api/payments`, `/api/payments/{id}` | Create: ADMIN/ACCOUNTANT/SECRETARY |
| GET/POST/PUT/DELETE | `/api/expenses`, `/api/expenses/{id}` | ADMIN/ACCOUNTANT (+ MANAGER read) |
| GET | `/api/expenses/total` | Aggregated expense total |
| GET/POST/PUT/DELETE | `/api/invoices`, `/api/invoices/{id}` | ADMIN/ACCOUNTANT (+ MANAGER read) |
| GET | `/api/invoices/status/{status}` | Filter by invoice status |

### Operations
| Method | Endpoint | Roles |
|--------|----------|-------|
| GET/POST/PUT/DELETE | `/api/housekeeping`, `/api/housekeeping/{id}` | ADMIN, MANAGER, HOUSEKEEPER |
| GET/POST/PUT/DELETE | `/api/maintenance`, `/api/maintenance/{id}` | ADMIN, MANAGER, MAINTENANCE |
| PUT | `/api/maintenance/{id}/status` | Update request status |
| GET/POST/PUT/DELETE | `/api/staff`, `/api/staff/{id}` | ADMIN, MANAGER |
| PUT | `/api/staff/{id}/status` | Activate/deactivate staff |

### Dashboard, reports, notifications, audit
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/stats` | Aggregated hotel statistics |
| GET | `/api/reports/revenue` \| `/revenue/monthly` \| `/revenue/by-room-type` | Revenue reports |
| GET | `/api/reports/occupancy` \| `/reservations` \| `/guests` \| `/payments` \| `/housekeeping` \| `/maintenance` \| `/expenses` | Operational reports |
| GET | `/api/notifications?userId=` | Notifications for a user |
| GET | `/api/notifications/unread-count/{userId}` | Unread count |
| PUT | `/api/notifications/{id}/read` \| `/read-all/{userId}` | Mark read |
| GET/POST | `/api/audit` (+ `/user/{userId}`, `/action/{action}`) | Audit log (ADMIN only) |

### Authorization

Role-based access is enforced server-side in `SecurityConfig`. Unauthenticated requests receive a JSON `401`; authenticated requests lacking the required role receive a JSON `403`. Guests can only access guest-auth, their own profile, and public endpoints.

## Project Structure

```
├── backend/                  # Spring Boot application (port 8081)
│   ├── pom.xml
│   └── src/main/java/com/fizzohotels/
│       ├── config/           # CORS configuration
│       ├── controller/       # 16 REST controllers
│       ├── dto/              # Request/response DTOs, ApiResponse envelope
│       ├── entity/           # JPA entities (User → Admin/GuestUser hierarchy)
│       ├── exception/        # Global exception handling
│       ├── repository/       # Spring Data JPA repositories
│       ├── security/         # JWT filter, JwtUtil, SecurityConfig (role rules)
│       ├── service/          # Business logic (abstract HotelService<T> template)
│       └── util/             # Demo data seeder
├── frontend/                 # React + Vite SPA (port 5173)
│   └── src/
│       ├── api/              # Axios instance + interceptors
│       ├── components/       # Layout, sidebar, routing guards, toasts
│       ├── context/          # AuthContext
│       └── pages/            # visitor/ guest/ + six staff role workspaces
└── database/                 # SQL schema & seed scripts
```

## OOP Concepts Demonstrated

1. **Encapsulation** — private fields with getters/setters in entity classes
2. **Inheritance** — abstract `User` superclass extended by `Admin` and `GuestUser`
3. **Polymorphism** — role-specific behavior (`displayRole()`, `displayDashboard()`) overridden in subclasses
4. **Abstraction** — abstract `HotelService<T>` defines the CRUD template all services implement
5. **Association** — entity relationships via JPA annotations (`@OneToMany`, `@ManyToOne`, `@OneToOne`)

## License

MIT

## Author

Fizzo Hotels Development Team
