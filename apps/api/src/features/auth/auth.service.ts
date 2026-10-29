import { createHash, randomInt, timingSafeEqual } from "node:crypto";
import {
  createEmailOtp,
  findUserByEmail,
  consumeOtp,
  createUser,
  findLatestSignupOtp,
  findLatestLoginOtp,
  incrementOtpAttempts,
  verifyOtpAtomically,
  createSession,
  rotateRefreshToken,
  findUserById,
  revokeSessionByToken,
  invalidateUnusedOtps,
  listActiveSessions,
  revokeSession,
  revokeOtherSessions,
} from "./auth.repository.js";
import { generateAccessToken } from "../../utils/jwt.js";
import {
  generateRefreshToken,
  hashRefreshToken,
} from "../../utils/refresh-token.js";

function hashOtp(otp: string): string {
  return createHash("sha256").update(otp).digest("hex");
}

export async function requestSignupOtp(input: { name: string; email: string }) {
  const existingUser = await findUserByEmail(input.email);

  if (existingUser) {
    throw new Error("An account with this email already exists.");
  }

  const otp = randomInt(0, 1_000_000).toString().padStart(6, "0");

  const otpHash = hashOtp(otp);

  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await createEmailOtp({
    email: input.email,
    name: input.name,
    otpHash,
    purpose: "signup",
    expiresAt,
  });

  // Temporary local-development output only.
  // Never log OTPs in production.
  if (process.env.NODE_ENV !== "production") {
    console.info(`[DEV ONLY] Signup OTP for ${input.email}: ${otp}`);
  }

  return {
    message:
      "If the signup request is valid, an OTP can be sent to your email.",
    expiresInSeconds: 300,
  };
}

export async function verifySignupOtp(input: { email: string; otp: string }) {
  const result = await verifyOtpAtomically({
    email: input.email,
    otp: input.otp,
  });

  if (!result.success) {
    if (result.reason === "too_many_attempts") {
      throw new Error("Too many OTP attempts. Please request a new OTP.");
    }

    throw new Error("Invalid or expired OTP.");
  }

  return {
    message: "Your account has been created successfully.",
    user: result.user,
  };
}

export async function requestLoginOtp(input: { email: string }) {
  const existingUser = await findUserByEmail(input.email);

  if (!existingUser) {
    throw new Error("Invalid email or login request.");
  }

  const otp = randomInt(0, 1_000_000).toString().padStart(6, "0");

  const otpHash = hashOtp(otp);

  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await createEmailOtp({
    email: input.email,
    name: null,
    otpHash,
    purpose: "login",
    expiresAt,
  });

  if (process.env.NODE_ENV !== "production") {
    console.info(`[DEV ONLY] Login OTP for ${input.email}: ${otp}`);
  }

  return {
    message: "If the login request is valid, an OTP can be sent to your email.",
    expiresInSeconds: 300,
  };
}

export async function verifyLoginOtp(input: {
  email: string;
  otp: string;
  device?: DeviceMetadata;
  ipAddress?: string;
  userAgent?: string;
}) {
  const result = await verifyOtpAtomically({
    email: input.email,
    otp: input.otp,
  });

  if (!result.success) {
    if (result.reason === "too_many_attempts") {
      throw new Error("Too many OTP attempts. Please request a new OTP.");
    }

    throw new Error("Invalid or expired OTP.");
  }

  const refreshToken = generateRefreshToken();

  const session = await createSession({
    userId: result.user.id,
    token: refreshToken,
    ...normalizeDevice(input),
  });
  const accessToken = generateAccessToken({
    ...result.user,
    sessionId: session.id,
  });

  return {
    message: "Login successful.",
    accessToken,
    refreshToken,
    tokenType: "Bearer",
    expiresIn: 900,
    user: result.user,
  };
}

export async function refreshAccessToken(input: { refreshToken: string }) {
  const oldTokenHash = hashRefreshToken(input.refreshToken);
  const newRefreshToken = generateRefreshToken();
  const newTokenHash = hashRefreshToken(newRefreshToken);

  const rotatedToken = await rotateRefreshToken({
    tokenHash: oldTokenHash,
    newTokenHash,
  });

  if (!rotatedToken) {
    throw new Error("Invalid or expired refresh token.");
  }

  const accessToken = generateAccessToken({
    id: rotatedToken.user_id,
    email: (await findUserById(rotatedToken.user_id)).email,
    sessionId: rotatedToken.session_id,
  });

  return {
    message: "Access token refreshed successfully.",
    accessToken,
    refreshToken: newRefreshToken,
    tokenType: "Bearer",
    expiresIn: 900,
  };
}

export async function logout(input: { refreshToken: string }) {
  const tokenHash = hashRefreshToken(input.refreshToken);

  await revokeSessionByToken(tokenHash);

  return {
    message: "Logged out successfully.",
  };
}

export async function resendOtp(input: { email: string }) {
  const existingUser = await findUserByEmail(input.email);

  // Determine the OTP flow from whether the user already exists.
  const purpose = existingUser ? "login" : "signup";

  // Signup requires a name, which the resend request does not provide.
  // Therefore, only resend signup OTPs when a pending signup exists.
  let name: string | null = null;

  if (purpose === "signup") {
    const pendingOtp = await findLatestSignupOtp(input.email);

    if (!pendingOtp || !pendingOtp.name) {
      throw new Error("Invalid or expired OTP request.");
    }

    name = pendingOtp.name;
  }

  await invalidateUnusedOtps({
    email: input.email,
    purpose,
  });

  const otp = randomInt(0, 1_000_000).toString().padStart(6, "0");
  const otpHash = hashOtp(otp);
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await createEmailOtp({
    email: input.email,
    name,
    otpHash,
    purpose,
    expiresAt,
  });

  if (process.env.NODE_ENV !== "production") {
    console.info(`[DEV ONLY] ${purpose} OTP for ${input.email}: ${otp}`);
  }

  return {
    message: "If the request is valid, a new OTP can be sent to your email.",
    expiresInSeconds: 300,
  };
}

export async function verifyOtp(input: {
  email: string;
  otp: string;
  device?: DeviceMetadata;
  ipAddress?: string;
  userAgent?: string;
}) {
  const result = await verifyOtpAtomically({
    email: input.email,
    otp: input.otp,
  });

  if (!result.success) {
    if (result.reason === "too_many_attempts") {
      throw new Error("Too many OTP attempts. Please request a new OTP.");
    }

    throw new Error("Invalid or expired OTP.");
  }

  const refreshToken = generateRefreshToken();

  const session = await createSession({
    userId: result.user.id,
    token: refreshToken,
    ...normalizeDevice(input),
  });
  const accessToken = generateAccessToken({
    ...result.user,
    sessionId: session.id,
  });

  return {
    created: result.isNewUser,
    message: result.isNewUser
      ? "Your account has been created successfully."
      : "Login successful.",
    accessToken,
    refreshToken,
    tokenType: "Bearer",
    expiresIn: 900,
    user: result.user,
  };
}

interface DeviceMetadata {
  name: string;
  model?: string;
  platform: "android" | "ios" | "web" | "unknown";
  osVersion?: string;
  appVersion?: string;
}

function normalizeDevice(input: {
  device?: DeviceMetadata;
  ipAddress?: string;
  userAgent?: string;
}) {
  return {
    deviceName: input.device?.name ?? "Unknown device",
    deviceModel: input.device?.model,
    platform: input.device?.platform ?? "unknown",
    osVersion: input.device?.osVersion,
    appVersion: input.device?.appVersion,
    ipAddress: input.ipAddress,
    userAgent: input.userAgent,
  };
}

export async function getSessions(userId: string, currentSessionId: string) {
  const sessions = await listActiveSessions(userId);

  return sessions.map((session) => ({
    ...session,
    current: session.id === currentSessionId,
  }));
}

export async function removeSession(userId: string, sessionId: string) {
  return revokeSession({ userId, sessionId });
}

export async function removeOtherSessions(
  userId: string,
  currentSessionId: string,
) {
  return revokeOtherSessions({ userId, currentSessionId });
}
