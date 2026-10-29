# What to add for a live Daynix database

This document is the live checklist for the current Daynix project. It matches the SQL the API already runs. Nothing in this list is optional if signup, login, and sessions should work on a real server.

The repository does not ship a migration runner. Creating the database and running the SQL below is a manual step on every new environment, including live.

## What already exists in the project

The API, mobile app, and local Docker Postgres are already in the repo. Live still needs its own database, its own secrets, and the four tables below. You do not insert starter rows. Users, codes, sessions, and refresh tokens are created by the API when people sign up and log in.

These apps do not talk to Postgres:

- `apps/web` — Next.js shell, no database
- `apps/docs` — documentation shell, no database
- `apps/mobile` — calls the API only. It needs the public API address, not a database URL

Only `apps/api` connects to the database, through `DATABASE_URL`.

## 1. Create the live Postgres database

Use PostgreSQL 17, the same major version as local Docker (`postgres:17-alpine` in `docker-compose.yml`).

Create a new database and a user that can connect to it. Do not reuse the local values:

| Local only (do not use live) | Value |
| --- | --- |
| Host | `localhost` |
| Port | `5432` |
| Database | `daynix` |
| User | `daynix_user` |
| Password | `local_dev_password` |

On a hosted database (Railway, Render, Supabase, Neon, RDS, and similar), turn on SSL and keep the database off the public internet except for the API server.

The connection string the API reads looks like this:

```text
postgresql://LIVE_USER:LIVE_PASSWORD@LIVE_HOST:5432/LIVE_DATABASE_NAME?sslmode=require
```

Put that value in the API environment as `DATABASE_URL`. The pool in `apps/api/src/config/database.ts` uses that string and nothing else.

## 2. Run this SQL once on the empty live database

Run the whole script in order. It creates the four tables the auth code reads and writes. Column names and types come from `apps/api/src/features/auth/auth.repository.ts` and `apps/api/src/middleware/auth.middleware.ts`.

```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(100) NOT NULL,
  email varchar(255) NOT NULL,
  avatar_url text,
  timezone text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT users_email_unique UNIQUE (email)
);

CREATE TABLE email_otps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email varchar(255) NOT NULL,
  name varchar(100),
  otp_hash char(64) NOT NULL,
  purpose text NOT NULL,
  expires_at timestamptz NOT NULL,
  attempts integer NOT NULL DEFAULT 0,
  consumed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT email_otps_purpose_check CHECK (purpose IN ('signup', 'login'))
);

CREATE INDEX email_otps_email_unused_idx
  ON email_otps (email, created_at DESC)
  WHERE consumed_at IS NULL;

CREATE TABLE user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  device_name varchar(120) NOT NULL,
  device_model varchar(120),
  platform text NOT NULL,
  os_version varchar(60),
  app_version varchar(40),
  ip_address inet,
  user_agent text,
  last_active_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  revoked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT user_sessions_platform_check
    CHECK (platform IN ('android', 'ios', 'web', 'unknown'))
);

CREATE INDEX user_sessions_user_active_idx
  ON user_sessions (user_id, last_active_at DESC)
  WHERE revoked_at IS NULL;

CREATE TABLE refresh_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  session_id uuid NOT NULL REFERENCES user_sessions (id) ON DELETE CASCADE,
  token_hash char(64) NOT NULL,
  expires_at timestamptz NOT NULL,
  revoked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT refresh_tokens_token_hash_unique UNIQUE (token_hash)
);

CREATE INDEX refresh_tokens_session_idx
  ON refresh_tokens (session_id);
```

After it finishes, these four tables must exist and stay empty until real signups:

| Table | What the API stores | You add rows? |
| --- | --- | --- |
| `users` | Name, lowercase email, optional avatar and timezone, timestamps | No. A row is inserted when a signup OTP is verified. |
| `email_otps` | SHA-256 hash of the 6-digit code, purpose `signup` or `login`, expiry (5 minutes), attempt count (max 5), and when it was used | No. A row is inserted on signup, login, and resend. |
| `user_sessions` | Device name, model, platform, OS, app version, IP, user agent, last activity, 30-day expiry, revocation | No. A row is inserted after OTP verification creates a session. |
| `refresh_tokens` | SHA-256 hash of the refresh token, linked user and session, 30-day expiry, revocation | No. A row is inserted with the session and replaced on each refresh. |

Plain OTP codes and plain refresh tokens are never stored. Only the SHA-256 hex hashes are stored (`otp_hash` and `token_hash`, 64 characters).

`ip_address` must be the Postgres `inet` type. The session list runs `host(ip_address)`.

`users.email` must be unique. The API looks up accounts by email.

`avatar_url` and `timezone` can stay null. The current API reads them and does not write them yet.

## 3. API environment variables on the live server

Create these on the host that runs the API. Do not commit them.

| Variable | Required | What to set |
| --- | --- | --- |
| `DATABASE_URL` | Yes | Live Postgres URL from section 1, with `sslmode=require` when the host requires SSL. The API refuses to start without this. |
| `JWT_SECRET` | Yes | A long random secret, different from local. Access tokens are signed with it for 15 minutes (`issuer` `daynix-api`, `audience` `daynix-app`). Login returns 500 if this is missing. |
| `PORT` | Yes on most hosts | Port the process listens on. If unset, the API uses `3001`. |
| `NODE_ENV` | Yes | Set to `production`. |

`apps/api/src/.env.example` only lists `PORT` and `DATABASE_URL`. Live also needs `JWT_SECRET` and `NODE_ENV`. The README local example is the full local set; replace every value for live.

Example shape (replace every value):

```env
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://LIVE_USER:LIVE_PASSWORD@LIVE_HOST:5432/LIVE_DATABASE_NAME?sslmode=require
JWT_SECRET=replace-with-a-long-random-secret
```

Generate the secret on your machine, for example:

```sh
openssl rand -base64 48
```

## 4. Mobile app address

The phone app does not get database credentials. Set this where the Expo app is built:

```env
EXPO_PUBLIC_API_URL=https://your-live-api-host/api
```

`localhost` only works on a simulator on the same computer. A real device and a store build need the public HTTPS API URL. The value is read in `apps/mobile/src/services/api/axiosInstance.ts`.

## 5. Email delivery is not in the project yet

Signup and login create a 6-digit code and save only its hash. Outside production, the API prints that code in the server log (`[DEV ONLY] ...`). When `NODE_ENV` is `production`, that log line is skipped, and there is no email provider in the code.

On live, the tables and API can accept signup and login, but the user will not receive the code until an email sender is added (for example Resend, Postmark, SES, or SMTP) and called from `apps/api/src/features/auth/auth.service.ts` in `requestSignupOtp`, `requestLoginOtp`, and `resendOtp`.

Until that exists, do not treat production OTP login as finished.

## 6. Other live settings the code does not lock down yet

These are already noted as production work. They are not extra database tables.

- **CORS.** `apps/api/src/app.ts` calls `cors()` with no origin list, so any website can call the API. Before a public web client, restrict CORS to the real web and app origins.
- **HTTPS.** Put the API behind HTTPS. The mobile app should call `https://`, not `http://`.
- **Database UI.** `docker-compose.yml` includes pgweb on port `8088` for local browsing. Do not run that against the live database on an open port.
- **Health check.** After deploy, `GET /health` should return `"database": "connected"`. That only proves the API can run `SELECT NOW()`. It does not prove the four tables exist. Hit signup only after the SQL in section 2 has been applied.

## 7. Order to do it

1. Create the live Postgres database and user. Save the URL.
2. Run the SQL in section 2. Confirm `users`, `email_otps`, `user_sessions`, and `refresh_tokens` exist and are empty.
3. Set `NODE_ENV`, `PORT`, `DATABASE_URL`, and `JWT_SECRET` on the API host.
4. Deploy the API and open `GET /health`.
5. Set `EXPO_PUBLIC_API_URL` to that API’s public `/api` URL and rebuild the mobile app.
6. Add an email provider before real users need the 6-digit code.
7. Restrict CORS when a browser client is public.

No admin user, no seed file, and no extra tables are required for the auth that is in the repo today. Task lists and the rest of the productivity features are not in the database yet.
