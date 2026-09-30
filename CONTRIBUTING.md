# Contributing to Hasmir Hotels

Thanks for your interest in improving the Hasmir Hotels Reservation & Management System! This guide covers everything you need to start contributing.

## Code of Conduct

By participating in this project you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please report unacceptable behavior via the contact in that document.

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- JDK 17+ and Maven 3.8+
- PostgreSQL 14+

### Setup

```bash
# 1. Clone and enter the project
git clone https://github.com/felix202422/Hotel_Management_System.git
cd Hotel_Management_System

# 2. Configure backend secrets
cd backend
cp .env.example .env        # then edit .env with your local values

# 3. Start the backend (http://localhost:8081)
mvn spring-boot:run

# 4. In a second terminal, start the frontend (http://localhost:5173)
cd ../frontend
npm install
npm run dev
```

Full setup details are in the [README](README.md).

## How Can I Contribute?

### Reporting Bugs

Open a [bug report](.github/ISSUE_TEMPLATE/bug_report.yml) and include:

- A clear, descriptive title
- Exact steps to reproduce
- Expected vs. actual behavior
- Screenshots or logs where relevant
- Your environment (OS, Java/Node versions, browser)

### Suggesting Enhancements

Open a [feature request](.github/ISSUE_TEMPLATE/feature_request.yml) describing the problem you're trying to solve, the proposed solution, and any alternatives you considered.

### Good First Issues

Look for issues labeled `good first issue` — these are scoped small and don't require deep knowledge of the codebase.

## Development Workflow

1. **Fork** the repository (or create a branch from `main` if you have write access)
2. **Branch** using one of these prefixes:
   - `feature/<short-description>` — new functionality
   - `fix/<short-description>` — bug fixes
   - `docs/<short-description>` — documentation only
   - `refactor/<short-description>` — code changes that neither fix a bug nor add a feature
3. **Commit** using [Conventional Commits](https://www.conventionalcommits.org/):
   ```
   feat(reservations): reject overlapping bookings
   fix(rooms): exact-match room number duplicate check
   docs: rewrite setup guide for port 8081
   ```
4. **Push** to your fork and open a [Pull Request](../../compare)

### Pull Request Checklist

- [ ] The PR description explains *what* changed and *why*
- [ ] `mvn clean compile` passes with no errors
- [ ] `npm run build` passes with no errors
- [ ] New endpoints follow the existing `ApiResponse<T>` envelope
- [ ] Authorization rules updated in `SecurityConfig` if you added endpoints
- [ ] No secrets, `.env` files, logs, or build artifacts are committed
- [ ] README updated if you changed setup, endpoints, or features

## Project Layout

```
backend/    Spring Boot 3.2 API (Java 17, port 8081)
frontend/   React 18 + Vite SPA (port 5173)
database/   SQL schema and seed scripts
docs/       Architecture and design documentation
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for how the pieces fit together.

## Code Style

**Backend (Java):**
- Constructor injection; no field `@Autowired` except in the seeder
- Controllers stay thin — business logic lives in services
- All responses use the `ApiResponse<T>` envelope
- New write endpoints must declare role rules in `SecurityConfig`

**Frontend (React):**
- Function components with hooks
- API calls go through the shared axios instance (`src/api/axios.js`)
- Role-specific pages live under `src/pages/<role>/`

## Questions?

Open a [discussion](../../discussions) or a [question issue](.github/ISSUE_TEMPLATE/question.yml) — we're happy to help.
