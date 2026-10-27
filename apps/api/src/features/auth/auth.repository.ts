import { pool } from "../../config/database.js";

export async function findUserByEmail(email: string) {
  const result = await pool.query(
    `SELECT id, name, email, avatar_url, timezone, created_at, updated_at
     FROM users
     WHERE email = $1
     LIMIT 1`,
    [email],
  );

  return result.rows[0] ?? null;
}

export async function createEmailOtp(input: {
  email: string;
  name: string | null;
  otpHash: string;
  purpose: "signup" | "login";
  expiresAt: Date;
}) {
  const result = await pool.query(
    `INSERT INTO email_otps
       (email, name, otp_hash, purpose, expires_at)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, email, purpose, expires_at, created_at`,
    [
      input.email,
      input.name,
      input.otpHash,
      input.purpose,
      input.expiresAt,
    ],
  );

  return result.rows[0];
}

export async function findLatestSignupOtp(email: string) {
  const result = await pool.query(
    `SELECT id, email, name, otp_hash, purpose, expires_at, attempts
     FROM email_otps
     WHERE email = $1
       AND purpose = 'signup'
       AND consumed_at IS NULL
     ORDER BY created_at DESC
     LIMIT 1`,
    [email],
  );

  return result.rows[0] ?? null;
}

export async function incrementOtpAttempts(otpId: string) {
  await pool.query(
    `UPDATE email_otps
     SET attempts = attempts + 1
     WHERE id = $1
       AND consumed_at IS NULL`,
    [otpId],
  );
}

export async function consumeOtp(otpId: string) {
  const result = await pool.query(
    `UPDATE email_otps
     SET consumed_at = NOW()
     WHERE id = $1
       AND consumed_at IS NULL
       AND expires_at > NOW()
     RETURNING id`,
    [otpId],
  );

  return result.rowCount === 1;
}

export async function createUser(input: {
  name: string;
  email: string;
}) {
  const result = await pool.query(
    `INSERT INTO users (name, email)
     VALUES ($1, $2)
     RETURNING id, name, email, avatar_url, timezone, created_at, updated_at`,
    [input.name, input.email],
  );

  return result.rows[0];
}