# iReporter

iReporter is a civic reporting application concept. It allows people to submit community concerns, provide updates, and follow the progress of reports. Administrators can review submissions and update their status.

This repository is a modernised rebuild of a personal demonstration project. It is intended for local development, learning and demonstration; it is not represented as a production service and has no real-world users or official government affiliation.

## Features

- Account registration and login using bcrypt password hashing.
- Signed JWT authentication.
- Role-based administrator access.
- Create, view, update and delete a user's own reports.
- Administrators can review all reports and update report status.
- Request validation, consistent error responses, security headers and rate limiting.
- MongoDB persistence through Mongoose.
- Automated API tests.

## Technology

Node.js, Express, MongoDB, Mongoose, bcryptjs, JSON Web Tokens, Zod, Jest and Supertest.

## Requirements

- Node.js 18 or newer
- MongoDB Community Server or a MongoDB connection string

## Setup

1. Clone the repository and install dependencies:

   ```bash
   npm install
   ```

2. Create a local environment file:

   ```bash
   cp .env.example .env
   ```

3. Set `MONGODB_URI` and replace `JWT_SECRET` with a long, random secret. Never commit `.env`.

4. Start the application:

   ```bash
   npm run dev
   ```

The API listens on `http://localhost:3000` by default.

## API overview

All endpoints are prefixed with `/api/v1`.

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/auth/register` | Public | Register an account |
| POST | `/auth/login` | Public | Log in and receive a token |
| GET | `/reports` | Signed in | List the signed-in user's reports |
| POST | `/reports` | Signed in | Submit a report |
| GET | `/reports/:id` | Signed in | View an owned report (admins can view any) |
| PATCH | `/reports/:id` | Signed in | Edit an owned report |
| DELETE | `/reports/:id` | Signed in | Delete an owned report |
| GET | `/admin/reports` | Admin | List all reports |
| PATCH | `/admin/reports/:id/status` | Admin | Change report status |

Send the JWT as `Authorization: Bearer <token>`.

### Register

```json
{
  "name": "Alex Example",
  "email": "alex@example.test",
  "password": "a-long-demo-password"
}
```

### Submit a report

```json
{
  "title": "Broken streetlight on Example Road",
  "description": "A streetlight near the fictional Example Park has stopped working.",
  "category": "infrastructure",
  "location": "Example Road, Sampletown"
}
```

Valid categories: `corruption`, `infrastructure`, `environment`, `public-safety`, `other`.

Valid statuses: `draft`, `submitted`, `under-investigation`, `resolved`, `rejected`.

## Creating an administrator

For safety, public registration always creates a standard user. To promote an account, use a trusted database administration session and update its role to `admin`:

```javascript
db.users.updateOne(
  { email: "admin@example.test" },
  { $set: { role: "admin" } }
)
```

Do not expose database administration credentials or an admin-promotion endpoint in the public API.

## Tests

```bash
npm test
```

The automated tests exercise validation and key API behaviours. Tests use a separate test database configured through `MONGODB_URI`; ensure it is disposable and never point tests at production data.

## Security notes

- Passwords are hashed with bcrypt and never returned by API responses.
- JWT secrets must be supplied through environment variables.
- Registration and login are rate-limited.
- User routes enforce ownership; administrator routes enforce an explicit admin role.
- Inputs are validated and database update operators are not accepted from clients.
- This is a demonstration baseline, not a security certification. Before production use, add operational monitoring, backups, email verification, password reset, CSRF protections if cookie authentication is introduced, and a formal security review.

## Project status

See [ROADMAP.md](ROADMAP.md) for proposed next steps. The rebuild does not claim real users, production deployment, or historical development activity beyond the original project history.

## Licence

ISC. See [LICENSE](LICENSE).
