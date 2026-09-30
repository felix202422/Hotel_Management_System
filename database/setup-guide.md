# Fizzo Hotels Reservation & Management System — Setup Guide

## 1. Prerequisites

| Tool         | Minimum Version | Download                                      |
|--------------|-----------------|-----------------------------------------------|
| Java         | 17+             | https://adoptium.net                          |
| Node.js      | 18+             | https://nodejs.org                            |
| PostgreSQL   | 15+             | https://www.postgresql.org/download           |
| Maven        | 3.8+            | https://maven.apache.org/download.cgi         |

Verify installed versions:

```bash
java -version
node --version
psql --version
mvn --version
```

---

## 2. Database Setup

### 2.1 Install PostgreSQL

Install PostgreSQL 15+ (pgAdmin is recommended for GUI management). During installation note the **port** (default `5432`) and the **postgres user password** you set.

### 2.2 Create the Database

Connect to PostgreSQL and create the database:

```bash
psql -U postgres
```

```sql
CREATE DATABASE fizzo_hotels;
\q
```

Or create it via pgAdmin by right-clicking **Databases** → **Create** → **Database** and entering `fizzo_hotels`.

### 2.3 Run the Schema Script

```bash
psql -U postgres -d fizzo_hotels -f database/schema.sql
```

### 2.4 (Optional) Load Sample Data

```bash
psql -U postgres -d fizzo_hotels -f database/seed-data.sql
```

> **Note:** The application can also seed default data on first run via Spring Boot. Running the SQL script manually is optional.

---

## 3. Backend Setup

### 3.1 Navigate to Backend

```bash
cd backend
```

### 3.2 Configure Database Credentials

Open `src/main/resources/application.properties` and update:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/fizzo_hotels
spring.datasource.username=postgres
spring.datasource.password=your_postgres_password
```

### 3.3 Build and Run

```bash
mvn clean install
mvn spring-boot:run
```

The backend server starts at **http://localhost:8080**.

---

## 4. Frontend Setup

### 4.1 Navigate to Frontend

```bash
cd frontend
```

### 4.2 Install Dependencies and Run

```bash
npm install
npm run dev
```

The frontend dev server starts at **http://localhost:3000**.

---

## 5. Access the Application

- **URL:** [http://localhost:3000](http://localhost:3000)
- **Default Login Credentials:**

  | Username | Password   |
  |----------|------------|
  | admin    | admin123   |

---

## 6. API Documentation

Base URL: `http://localhost:8080/api`

### Authentication

| Method | Endpoint           | Description        |
|--------|--------------------|--------------------|
| POST   | `/api/auth/login`  | Admin login        |

### Rooms

| Method | Endpoint              | Description               |
|--------|-----------------------|---------------------------|
| GET    | `/api/rooms`          | List all rooms            |
| GET    | `/api/rooms/{id}`     | Get room by ID            |
| POST   | `/api/rooms`          | Create a new room         |
| PUT    | `/api/rooms/{id}`     | Update room details       |
| DELETE | `/api/rooms/{id}`     | Delete a room             |
| PATCH  | `/api/rooms/{id}/status` | Update room status     |

### Guests

| Method | Endpoint                | Description          |
|--------|-------------------------|----------------------|
| GET    | `/api/guests`           | List all guests      |
| GET    | `/api/guests/{id}`      | Get guest by ID      |
| POST   | `/api/guests`           | Register a guest     |
| PUT    | `/api/guests/{id}`      | Update guest details |
| DELETE | `/api/guests/{id}`      | Delete a guest       |

### Reservations

| Method | Endpoint                         | Description              |
|--------|----------------------------------|--------------------------|
| GET    | `/api/reservations`              | List all reservations    |
| GET    | `/api/reservations/{id}`         | Get reservation by ID    |
| POST   | `/api/reservations`              | Create a reservation     |
| PUT    | `/api/reservations/{id}`         | Update reservation       |
| DELETE | `/api/reservations/{id}`         | Delete a reservation     |
| PATCH  | `/api/reservations/{id}/status`  | Update reservation status|

### Payments

| Method | Endpoint                 | Description         |
|--------|--------------------------|---------------------|
| GET    | `/api/payments`          | List all payments   |
| GET    | `/api/payments/{id}`     | Get payment by ID   |
| POST   | `/api/payments`          | Process a payment   |
| PUT    | `/api/payments/{id}`     | Update payment      |

### Housekeeping

| Method | Endpoint                          | Description               |
|--------|-----------------------------------|---------------------------|
| GET    | `/api/housekeeping`               | List all housekeeping     |
| GET    | `/api/housekeeping/{id}`          | Get record by ID          |
| POST   | `/api/housekeeping`               | Assign housekeeping       |
| PUT    | `/api/housekeeping/{id}`          | Update housekeeping       |
| PATCH  | `/api/housekeeping/{id}/status`   | Update cleaning status    |

### Dashboard

| Method | Endpoint                | Description               |
|--------|-------------------------|---------------------------|
| GET    | `/api/dashboard/stats`  | Get dashboard statistics  |

---

## 7. Troubleshooting

| Problem                          | Solution                                                       |
|----------------------------------|----------------------------------------------------------------|
| Port 5432 already in use         | Stop existing PostgreSQL service or change port in config      |
| `relation "admin" does not exist`| Run `schema.sql` first — the tables have not been created      |
| `role "postgres" does not exist` | Create the role: `CREATE ROLE postgres WITH LOGIN SUPERUSER;`   |
| Backend won't start              | Verify PostgreSQL is running and credentials in `application.properties` are correct |
| `npm install` fails              | Clear cache: `npm cache clean --force` then retry              |
| CORS errors on frontend          | Ensure backend is running on port 8080 and frontend on 3000    |
| Login fails with default creds   | The BCrypt hash in seed data may need aligning with your app encoding; re-register via the app or update the hash manually |

---

## 8. Project Structure

```
fizzo-hotels/
├── backend/                      # Spring Boot REST API
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/fizzo/hotels/
│   │   │   │   ├── controller/   # REST controllers
│   │   │   │   ├── service/      # Business logic
│   │   │   │   ├── repository/   # JPA repositories
│   │   │   │   ├── model/        # JPA entities
│   │   │   │   ├── dto/          # Data transfer objects
│   │   │   │   └── config/       # Security & app config
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   └── pom.xml
├── frontend/                     # React / Next.js UI
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   ├── pages/                # Page routes
│   │   ├── services/             # API client modules
│   │   └── styles/               # CSS / Tailwind styles
│   ├── package.json
│   └── next.config.js
└── database/                     # SQL scripts
    ├── schema.sql                # Full database schema
    ├── seed-data.sql             # Sample / demo data
    └── setup-guide.md            # This file
```
