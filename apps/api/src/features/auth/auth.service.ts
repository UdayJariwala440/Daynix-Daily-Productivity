import { createHash, randomInt } from "node:crypto";
import bcrypt from "bcryptjs";
import {
  createEmailOtp,
  findUserByEmail,
} from "./auth.repository.js";

function hashOtp(otp: string): string {
  return createHash("sha256").update(otp).digest("hex");
}

export async function requestSignupOtp(input: {
  name: string;
  email: string;
}) {
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
    message: "If the signup request is valid, an OTP can be sent to your email.",
    expiresInSeconds: 300,
  };
}