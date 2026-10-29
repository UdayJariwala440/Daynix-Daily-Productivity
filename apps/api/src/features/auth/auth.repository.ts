import { timingSafeEqual } from "node:crypto";
import { pool } from "../../config/database.js";
import { hashRefreshToken } from "../../utils/refresh-token.js";

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
    [input.email, input.name, input.otpHash, input.purpose, input.expiresAt],
  );

  return result.rows[0];
}

export async function verifyOtpAtomically(input: {
  email: string;
  otp: string;
}) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Lock the latest unused OTP; its purpose determines signup vs login.
    const result = await client.query(
      `SELECT id, email, name, purpose, otp_hash, expires_at, attempts
       FROM email_otps
       WHERE email = $1
         AND consumed_at IS NULL
       ORDER BY created_at DESC
       LIMIT 1
       FOR UPDATE`,
      [input.email],
    );

    const record = result.rows[0];

    if (!record) {
      await client.query("ROLLBACK");
      return { success: false as const, reason: "invalid" as const };
    }

    if (Number(record.attempts) >= 5) {
      await client.query("COMMIT");
      return {
        success: false as const,
        reason: "too_many_attempts" as const,
      };
    }

    if (new Date(record.expires_at).getTime() <= Date.now()) {
      await client.query("COMMIT");
      return { success: false as const, reason: "invalid" as const };
    }

    const submittedHash = Buffer.from(
      (await import("node:crypto"))
        .createHash("sha256")
        .update(input.otp)
        .digest("hex"),
      "hex",
    );

    const storedHash = Buffer.from(record.otp_hash, "hex");

    const matches =
      submittedHash.length === storedHash.length &&
      timingSafeEqual(submittedHash, storedHash);

    if (!matches) {
      await client.query(
        `UPDATE email_otps
         SET attempts = attempts + 1
         WHERE id = $1`,
        [record.id],
      );

      await client.query("COMMIT");

      return { success: false as const, reason: "invalid" as const };
    }

    const consumed = await client.query(
      `UPDATE email_otps
       SET consumed_at = NOW()
       WHERE id = $1
         AND consumed_at IS NULL
         AND expires_at > NOW()
       RETURNING id`,
      [record.id],
    );

    if (consumed.rowCount !== 1) {
      await client.query("ROLLBACK");
      return { success: false as const, reason: "invalid" as const };
    }

    let user;

    if (record.purpose === "signup") {
      if (!record.name) {
        await client.query("ROLLBACK");
        return { success: false as const, reason: "invalid" as const };
      }

      const userResult = await client.query(
        `INSERT INTO users (name, email)
         VALUES ($1, $2)
         RETURNING id, name, email, avatar_url, timezone,
                   created_at, updated_at`,
        [record.name, record.email],
      );

      user = userResult.rows[0];
    } else {
      const userResult = await client.query(
        `SELECT id, name, email, avatar_url, timezone,
                created_at, updated_at
         FROM users
         WHERE email = $1
         LIMIT 1`,
        [record.email],
      );

      user = userResult.rows[0];

      if (!user) {
        await client.query("ROLLBACK");
        return { success: false as const, reason: "invalid" as const };
      }
    }

    await client.query("COMMIT");

    return {
      success: true as const,
      user,
      isNewUser: record.purpose === "signup",
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
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

export async function createUser(input: { name: string; email: string }) {
  const result = await pool.query(
    `INSERT INTO users (name, email)
     VALUES ($1, $2)
     RETURNING id, name, email, avatar_url, timezone, created_at, updated_at`,
    [input.name, input.email],
  );

  return result.rows[0];
}

export async function findLatestLoginOtp(email: string) {
  const result = await pool.query(
    `SELECT id, email, name, otp_hash, purpose, expires_at, attempts
     FROM email_otps
     WHERE email = $1
       AND purpose = 'login'
       AND consumed_at IS NULL
     ORDER BY created_at DESC
     LIMIT 1`,
    [email],
  );

  return result.rows[0] ?? null;
}

export async function createSession(input: {
  userId: string;
  token: string;
  deviceName: string;
  deviceModel?: string;
  platform: string;
  osVersion?: string;
  appVersion?: string;
  ipAddress?: string;
  userAgent?: string;
}) {
  const tokenHash = hashRefreshToken(input.token);
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const sessionResult = await client.query(
      `INSERT INTO user_sessions (
         user_id, device_name, device_model, platform, os_version,
         app_version, ip_address, user_agent, expires_at
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW() + INTERVAL '30 days')
       RETURNING id, user_id, expires_at, created_at`,
      [
        input.userId,
        input.deviceName,
        input.deviceModel ?? null,
        input.platform,
        input.osVersion ?? null,
        input.appVersion ?? null,
        input.ipAddress ?? null,
        input.userAgent ?? null,
      ],
    );

    const session = sessionResult.rows[0];

    await client.query(
      `INSERT INTO refresh_tokens (user_id, session_id, token_hash, expires_at)
       VALUES ($1, $2, $3, NOW() + INTERVAL '30 days')`,
      [input.userId, session.id, tokenHash],
    );

    await client.query("COMMIT");

    return session;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function findValidRefreshToken(tokenHash: string) {
  const result = await pool.query(
    `SELECT rt.id, rt.user_id, u.email
     FROM refresh_tokens rt
     JOIN users u ON u.id = rt.user_id
     WHERE rt.token_hash = $1
       AND rt.revoked_at IS NULL
       AND rt.expires_at > NOW()
     LIMIT 1`,
    [tokenHash],
  );

  return result.rows[0] ?? null;
}

export async function rotateRefreshToken(input: {
  tokenHash: string;
  newTokenHash: string;
}) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const tokenResult = await client.query(
      `SELECT rt.id, rt.user_id, rt.session_id
       FROM refresh_tokens rt
       JOIN user_sessions us ON us.id = rt.session_id
       WHERE rt.token_hash = $1
         AND rt.revoked_at IS NULL
         AND rt.expires_at > NOW()
         AND us.revoked_at IS NULL
         AND us.expires_at > NOW()
       FOR UPDATE`,
      [input.tokenHash],
    );

    const token = tokenResult.rows[0];

    if (!token) {
      await client.query("ROLLBACK");
      return null;
    }

    const revokeResult = await client.query(
      `UPDATE refresh_tokens
       SET revoked_at = NOW()
       WHERE id = $1
         AND revoked_at IS NULL
       RETURNING user_id`,
      [token.id],
    );

    if (revokeResult.rowCount !== 1) {
      await client.query("ROLLBACK");
      return null;
    }

    const newTokenResult = await client.query(
      `INSERT INTO refresh_tokens (
         user_id,
         session_id,
         token_hash,
         expires_at
       )
       VALUES ($1, $2, $3, NOW() + INTERVAL '30 days')
       RETURNING id, user_id, session_id, expires_at`,
      [token.user_id, token.session_id, input.newTokenHash],
    );

    await client.query(
      `UPDATE user_sessions
       SET last_active_at = NOW(),
           expires_at = NOW() + INTERVAL '30 days'
       WHERE id = $1
         AND revoked_at IS NULL`,
      [token.session_id],
    );

    await client.query("COMMIT");

    return newTokenResult.rows[0];
  } catch (error) {
    try {
      await client.query("ROLLBACK");
    } catch {
      // Preserve the original error if rollback also fails.
    }

    throw error;
  } finally {
    client.release();
  }
}

export async function findUserById(userId: string) {
  const result = await pool.query(
    `SELECT id, name, email, avatar_url, timezone,
            created_at, updated_at
     FROM users
     WHERE id = $1
     LIMIT 1`,
    [userId],
  );

  return result.rows[0] ?? null;
}

export async function revokeSessionByToken(tokenHash: string) {
  const result = await pool.query(
    `WITH target AS (
       SELECT session_id
       FROM refresh_tokens
       WHERE token_hash = $1
       LIMIT 1
     ), revoked_session AS (
       UPDATE user_sessions
       SET revoked_at = NOW()
       WHERE id = (SELECT session_id FROM target)
         AND revoked_at IS NULL
       RETURNING id
     )
     UPDATE refresh_tokens
     SET revoked_at = COALESCE(revoked_at, NOW())
     WHERE session_id = (SELECT id FROM revoked_session)
     RETURNING id`,
    [tokenHash],
  );

  return (result.rowCount ?? 0) > 0;
}

export async function listActiveSessions(userId: string) {
  const result = await pool.query(
    `SELECT id, device_name, device_model, platform, os_version, app_version,
            host(ip_address) AS ip_address, last_active_at, created_at, expires_at
     FROM user_sessions
     WHERE user_id = $1
       AND revoked_at IS NULL
       AND expires_at > NOW()
     ORDER BY last_active_at DESC`,
    [userId],
  );

  return result.rows;
}

export async function revokeSession(input: {
  userId: string;
  sessionId: string;
}) {
  const result = await pool.query(
    `WITH revoked_session AS (
       UPDATE user_sessions
       SET revoked_at = NOW()
       WHERE id = $1
         AND user_id = $2
         AND revoked_at IS NULL
       RETURNING id
     )
     UPDATE refresh_tokens
     SET revoked_at = COALESCE(revoked_at, NOW())
     WHERE session_id = (SELECT id FROM revoked_session)
     RETURNING id`,
    [input.sessionId, input.userId],
  );

  return (result.rowCount ?? 0) > 0;
}

export async function revokeOtherSessions(input: {
  userId: string;
  currentSessionId: string;
}) {
  const result = await pool.query(
    `WITH revoked_sessions AS (
       UPDATE user_sessions
       SET revoked_at = NOW()
       WHERE user_id = $1
         AND id <> $2
         AND revoked_at IS NULL
       RETURNING id
     ), revoked_tokens AS (
       UPDATE refresh_tokens
       SET revoked_at = COALESCE(revoked_at, NOW())
       WHERE session_id IN (SELECT id FROM revoked_sessions)
       RETURNING id
     )
     SELECT COUNT(*)::int AS count FROM revoked_sessions`,
    [input.userId, input.currentSessionId],
  );

  return Number(result.rows[0]?.count ?? 0);
}

export async function invalidateUnusedOtps(input: {
  email: string;
  purpose: "signup" | "login";
}) {
  await pool.query(
    `UPDATE email_otps
     SET consumed_at = NOW()
     WHERE email = $1
       AND purpose = $2
       AND consumed_at IS NULL`,
    [input.email, input.purpose],
  );
}
