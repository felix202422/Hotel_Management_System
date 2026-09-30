# Architecture

Hasmir Hotels is a full-stack hotel reservation and management system: a React SPA talking to a Spring Boot REST API over PostgreSQL.

## High-Level View

```
┌─────────────────────────────┐
│  React SPA (Vite, :5173)    │
│  visitor site + guest portal│
│  + 6 staff role workspaces  │
└──────────────┬──────────────┘
               │ /api/* via Vite dev proxy
┌──────────────▼──────────────┐
│  Spring Boot API (:8081)    │
│  16 controllers             │
│  JWT + role authorization   │
└──────────────┬──────────────┘
               │ Spring Data JPA / Hibernate
┌──────────────▼──────────────┐
│  PostgreSQL (hasmir_hotels_db) │
└─────────────────────────────┘
```

## Backend Layering

```
controller/   REST endpoints; thin; return ApiResponse<T>
service/      Business logic; extend abstract HotelService<T>
repository/   Spring Data JPA interfaces (+ custom @Query)
entity/       JPA entities; User → Admin / GuestUser hierarchy
dto/          Request/response shapes; ApiResponse envelope
security/     SecurityConfig (role matrix), JwtUtil, JWT filter
exception/    Global exception handling
config/       CORS; environment post-processor (fail-fast config)
util/         DataSeeder — idempotent demo data on startup
```

Request flow: `HTTP → JwtAuthenticationFilter (token → ROLE_x authority) → SecurityConfig URL rules → Controller → Service → Repository → PostgreSQL`.

## Frontend Structure

```
src/api/axios.js       Axios instance; injects Bearer token; unwraps ApiResponse;
                       normalizes pagination; redirects to /login on 401
src/context/AuthContext Login/logout state, persisted to localStorage
src/components/        ProtectedRoute, RoleBasedLayout, RoleBasedSidebar, modals, toasts
src/pages/visitor/     Public site (rooms, booking lookup, contact)
src/pages/guest/       Guest portal
src/pages/<role>/      One workspace per staff role; routes in App.jsx
```

Routing: `App.jsx` maps each role to its route subtree via `ProtectedRoute roles={[...]}`; unknown roles redirect to their own dashboard.

## Roles & Authorization

Nine roles: `ADMIN`, `MANAGER`, `SECRETARY`, `HOUSEKEEPER`/`HOUSEKEEPING_STAFF`, `ACCOUNTANT`, `MAINTENANCE`/`MAINTENANCE_STAFF`, `GUEST`.

The JWT carries `role` as a claim; the filter converts it to `ROLE_<role>`, and `SecurityConfig` maps URL patterns per resource and HTTP method. Authorization is server-side only — the frontend guards are UX, not security.

## Key Domain Rules

- Reservation date ranges use half-open interval semantics: checkout day is bookable by the next guest. Overlap validation lives in `ReservationRepository.countOverlappingReservations`.
- Room numbers are unique, case-insensitive, exact-match.
- Creating a reservation flips the room to `Reserved`; check-in to `Occupied`.
- Payments are 1:1 with reservations (`@OneToOne`).
- Startup fails fast if `DB_PASSWORD` or `JWT_SECRET` are missing/short (see `RequiredConfigEnvironmentPostProcessor`).

## Configuration & Secrets

`backend/.env` (gitignored, properties format) is imported by Spring via `spring.config.import=optional:file:./.env[.properties]`. Copy `backend/.env.example` as a starting point. Real environment variables and `-D` system properties take precedence over `.env`.

## Data Seeding

`DataSeeder` runs once on first boot (`count() == 0` guards) and creates 7 staff users, 20 rooms, 20 guests, 32 reservations, payments, housekeeping, maintenance, notifications, audit logs, and expenses. The SQL scripts in `database/` are an alternative manual path.
