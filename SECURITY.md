# Security Policy

## Supported Versions

We release security fixes for the following versions:

| Version | Supported          |
|---------|--------------------|
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take security seriously and appreciate responsible disclosure.

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, report them privately via [GitHub Security Advisories](../../security/advisories/new)
("Report a vulnerability") or email **felixyhaule@gmail.com** with:

- A description of the vulnerability and its impact
- Step-by-step instructions or a proof of concept to reproduce
- Affected endpoints, files, or components
- Any suggested fixes (optional)

### What to Expect

- **Acknowledgement** within 72 hours
- **Initial assessment** within 7 days
- We will work with you on a fix and coordinate a disclosure date
- Credit is given to reporters in the fix release notes unless you prefer anonymity

### Scope

The following are in scope:

- The Spring Boot backend (`backend/`) — authentication, authorization, injection, IDOR
- The React frontend (`frontend/`) — XSS, sensitive data exposure
- Database scripts (`database/`) — privilege escalation vectors

Out of scope:

- Vulnerabilities requiring physical access to a machine
- Social engineering attacks
- Denial-of-service via volume
- Issues in third-party dependencies not exploitable in this project (still appreciated — we will bump versions)

## Security Design Notes

- All secrets (database password, JWT signing key) are read from environment variables — never commit `.env`
- Passwords are hashed with BCrypt
- API authorization is enforced server-side in `SecurityConfig` per role
- JWTs are stateless with 24h expiry; no refresh tokens yet (see roadmap)
