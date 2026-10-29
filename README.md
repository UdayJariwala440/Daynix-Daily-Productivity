# Daynix Daily Productivity

Daynix is a cross-platform productivity application for organizing tasks, tracking progress, and building productive daily routines. The repository is a TypeScript monorepo containing the mobile client, web and documentation apps, a REST API, a shared UI package, and shared development configuration.

## Current features

- Email-based signup and login using six-digit OTPs
- JWT access tokens with rotating refresh tokens
- Secure token storage on iOS and Android
- Device-aware session management
- View active sessions and revoke one or all other sessions
- PostgreSQL-backed user, OTP, token, and session data
- API and database health check

The authentication flow is implemented. The wider task-management and productivity features are under development.

## Technology stack

| Area                 | Technologies                                                                 |
| -------------------- | ---------------------------------------------------------------------------- |
| Mobile               | React Native 0.88, Expo 58, Expo Router, React 19, Axios                     |
| Web                  | Next.js 16, React 19                                                         |
| Documentation app    | Next.js 16, React 19                                                         |
| API                  | Node.js, Express 5, TypeScript, Zod                                          |
| Database             | PostgreSQL 17, `pg` connection pooling and parameterized SQL                 |
| Authentication       | Email OTPs, JSON Web Tokens (JWT), rotating refresh tokens, Expo SecureStore |
| API security         | Helmet, CORS, SHA-256 token and OTP hashing                                  |
| Monorepo tooling     | Turborepo, pnpm workspaces                                                   |
| Code quality         | TypeScript, ESLint, Prettier                                                 |
| Local infrastructure | Docker Compose                                                               |

## Database

Daynix uses PostgreSQL as its relational database. Local development runs PostgreSQL 17 in Docker with a persistent named volume, while the API connects through the `DATABASE_URL` environment variable and a `pg` connection pool.

The authentication implementation uses these tables:

| Table            | Purpose                                                                                  |
| ---------------- | ---------------------------------------------------------------------------------------- |
| `users`          | Stores user profiles, email addresses, time zones, and timestamps                        |
| `email_otps`     | Stores hashed signup/login OTPs, expiration times, attempt counts, and consumption state |
| `user_sessions`  | Tracks authenticated devices, client metadata, activity, expiration, and revocation      |
| `refresh_tokens` | Stores hashed, rotating refresh tokens associated with users and device sessions         |

Sensitive OTP and refresh-token values are not stored in plaintext. Verification and token rotation use database transactions to keep authentication state consistent.

The local Docker database is configured as follows:

```text
Host: localhost
Port: 5432
Database: daynix
User: daynix_user
Password: local_dev_password
```

These credentials are for local development only and must not be reused in production.

## Repository structure

```text
apps/
  api/       Express REST API and PostgreSQL access
  mobile/    Expo and React Native application
  web/       Next.js web application
  docs/      Next.js documentation application
packages/
  ui/                    Shared React components
  eslint-config/         Shared lint configuration
  typescript-config/     Shared TypeScript configuration
```

## Architecture

The mobile app communicates with the Express REST API over HTTP using Axios. The API validates requests with Zod, handles authentication and session rules in its service layer, and reads and writes PostgreSQL through repository functions. The mobile app stores access and refresh tokens in Expo SecureStore on native platforms and automatically attempts token refresh after an unauthorized response.

## Local development

### Prerequisites

- Node.js 24 or later
- pnpm 11.25.0
- Docker with Docker Compose
- Expo-compatible iOS/Android tooling when running the mobile app

### 1. Install dependencies

```sh
pnpm install
```

### 2. Start PostgreSQL

```sh
docker compose up -d db
```

### 3. Configure the API

Create `apps/api/.env` with values suitable for local development:

```env
PORT=3001
DATABASE_URL=postgresql://daynix_user:local_dev_password@localhost:5432/daynix
JWT_SECRET=replace-with-a-long-random-secret
```

The database tables listed above must exist before using the authentication endpoints. The repository does not currently include a migration runner.

### 4. Configure the mobile app

Create `apps/mobile/.env` and point it at the API. Use your computer's LAN address instead of `localhost` when testing on a physical device.

```env
EXPO_PUBLIC_API_URL=http://localhost:3001/api
```

### 5. Start the applications

Run every development task from the repository root:

```sh
pnpm dev
```

Or run an individual application:

```sh
pnpm --filter api dev
pnpm --filter mobile start
pnpm --filter web dev
pnpm --filter docs dev
```

## API overview

The API exposes a welcome route at `/`, a database-aware health check at `/health`, and authentication routes under `/api/auth`.

Key authentication operations include signup, login, OTP verification/resending, profile retrieval, token refresh, logout, session listing, and session revocation. See [apps/api/API.md](apps/api/API.md) for request/response details.

## Quality checks

```sh
pnpm lint
pnpm check-types
pnpm build
```

## Security notes

- Never commit `.env` files or production credentials.
- Use a strong, randomly generated `JWT_SECRET` in every deployed environment.
- Local OTPs are printed by the API only outside production until an email provider is integrated.
- Production deployments should restrict CORS to trusted origins and use encrypted database connections where required.

<!-- testuser991@yopmail.com
user this as testing for the local -->
<!-- http://localhost:8088.


for the live db
 -->
