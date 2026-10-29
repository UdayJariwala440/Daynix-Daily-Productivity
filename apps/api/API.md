# Daynix API reference

Base path: `/api/auth`

The API accepts and returns JSON. Send `Content-Type: application/json` for requests with a body. Email addresses are trimmed and converted to lowercase before processing.

## Authentication

### `POST /signup`

Request an email verification code for a new account.

Request:

```json
{
  "name": "Alex Example",
  "email": "alex@example.com"
}
```

`name` must contain 2–100 characters. `email` must be a valid address up to 255 characters.

Success (`200`):

```json
{
  "success": true,
  "message": "If the signup request is valid, an OTP can be sent to your email.",
  "expiresInSeconds": 300
}
```

Validation failure (`400`) includes `errors`, an array of `{ "field", "message" }` entries.

### `POST /login`

Request a login code for an existing account.

Request:

```json
{
  "email": "alex@example.com"
}
```

Success (`200`) returns `success`, a generic `message`, and `expiresInSeconds: 300` in the same shape as signup. Invalid input returns `400` with `message` and an `errors` array. An unknown account is rejected by the service.

### `POST /verify-otp`

Verify the most recent unused code for the email. The OTP must be a string of exactly six digits.

Request:

```json
{
  "email": "alex@example.com",
  "otp": "012345",
  "device": {
    "name": "Alex's iPhone",
    "model": "iPhone 17 Pro",
    "platform": "ios",
    "osVersion": "26.0",
    "appVersion": "1.0.0"
  }
}
```

`device` is optional for older clients. When supplied, it is attached to the new login session. The API records the request IP and user agent from the HTTP request rather than trusting client-provided values.

Successful signup (`201`):

```json
{
  "success": true,
  "message": "Your account has been created successfully.",
  "accessToken": "<accessToken>",
  "refreshToken": "<refreshToken>",
  "tokenType": "Bearer",
  "expiresIn": 900,
  "user": {
    "id": "user-id",
    "name": "Alex Example",
    "email": "alex@example.com",
    "avatar_url": null,
    "timezone": "UTC",
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z"
  }
}
```

Successful login (`200`) returns the same token and user fields with `message: "Login successful."`. Both signup and login create an active device session.

Invalid or expired code returns `400`; five failed attempts for a code result in `429`. Invalid request shape returns `400` with `message`.

### `POST /resend-otp`

Request a replacement code for the email.

Request:

```json
{
  "email": "alex@example.com"
}
```

Success (`200`) returns `success`, a generic `message`, and `expiresInSeconds: 300`. An invalid email returns `400` with `message` and `errors`. If there is no pending signup or eligible login request, the API returns `400` with `"Invalid or expired OTP request."`.

### `GET /me`

Get the current user's profile. Requires an access token.

Header:

```text
Authorization: Bearer <accessToken>
```

Success (`200`):

```json
{
  "success": true,
  "user": {
    "id": "user-id",
    "name": "Alex Example",
    "email": "alex@example.com",
    "avatar_url": null,
    "timezone": "UTC",
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z"
  }
}
```

Missing, invalid, or expired access token returns `401` with `success: false` and `message`.

### `POST /refresh`

Exchange a refresh token for a new access and refresh token pair. Refresh tokens rotate when used.

Request:

```json
{
  "refreshToken": "<refreshToken>"
}
```

Success (`200`) returns `success`, `message`, `accessToken`, `refreshToken`, `tokenType: "Bearer"`, and `expiresIn: 900`. Missing or empty token returns `400`; invalid or expired token returns `401`.

### `POST /logout`

Revoke a refresh token.

Request:

```json
{
  "refreshToken": "<refreshToken>"
}
```

Success (`200`):

```json
{
  "success": true,
  "message": "Logged out successfully."
}
```

Missing or empty token returns `400`.

### `GET /sessions`

List the current user's active device sessions. Requires an access token.

Success (`200`):

```json
{
  "success": true,
  "sessions": [
    {
      "id": "session-id",
      "device_name": "Alex's iPhone",
      "device_model": "iPhone 17 Pro",
      "platform": "ios",
      "os_version": "26.0",
      "app_version": "1.0.0",
      "ip_address": "203.0.113.10",
      "last_active_at": "2026-10-28T12:00:00.000Z",
      "created_at": "2026-10-28T12:00:00.000Z",
      "expires_at": "2026-11-27T12:00:00.000Z",
      "current": true
    }
  ]
}
```

Only non-revoked, unexpired sessions are returned. `current` is derived from the signed access token's session claim.

### `DELETE /sessions/:sessionId`

Log out one active device belonging to the current user. Requires an access token. Success (`200`) returns `currentSessionRevoked`; clients should clear local credentials when it is `true`. An unknown, already-revoked, or other user's session returns `404`.

### `DELETE /sessions/others`

Log out every active device except the device making the request. Requires an access token. Success (`200`) returns `revokedCount`.

Revoking a session invalidates all refresh tokens in that token family. Authenticated requests also check that the session is still active, so revocation takes effect immediately rather than waiting for the 15-minute access token to expire.

## OTP behavior

- Codes contain six digits and expire after 300 seconds (5 minutes).
- Each code allows up to five failed verification attempts. Further verification attempts return `429`.
- Resending invalidates the prior unused code and creates a replacement with a fresh 5-minute expiry.
- The mobile app displays a 30-second resend countdown. The API currently does not enforce a resend cooldown or a total resend limit.
- Verification and resend operate on the latest unused code for the email.

## Response conventions

Controller responses use `success: true` for successful requests and `success: false` for handled errors. Error responses generally include a human-readable `message`; validation responses may also include `errors`. Server or database failures can return `500`.
