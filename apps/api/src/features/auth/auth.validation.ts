import { z } from "zod";

export const signupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must contain at least 2 characters")
    .max(100, "Name must not exceed 100 characters"),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .max(255, "Email must not exceed 255 characters")
    .transform((email) => email.toLowerCase()),
});

export type SignupInput = z.infer<typeof signupSchema>;

export const verifySignupOtpSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .max(255, "Email must not exceed 255 characters")
    .transform((email) => email.toLowerCase()),

  otp: z.string().regex(/^\d{6}$/, "OTP must be exactly 6 digits"),
});

export type VerifySignupOtpInput = z.infer<typeof verifySignupOtpSchema>;

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .max(255, "Email must not exceed 255 characters")
    .transform((email) => email.toLowerCase()),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const verifyLoginOtpSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .max(255, "Email must not exceed 255 characters")
    .transform((email) => email.toLowerCase()),

  otp: z.string().regex(/^\d{6}$/, "OTP must be exactly 6 digits"),
});

export type VerifyLoginOtpInput = z.infer<typeof verifyLoginOtpSchema>;

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required."),
});

export const resendOtpSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .max(255, "Email must not exceed 255 characters")
    .transform((email) => email.toLowerCase()),
});

export type ResendOtpInput = z.infer<typeof resendOtpSchema>;

export const verifyOtpSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .max(255, "Email must not exceed 255 characters")
    .transform((email) => email.toLowerCase()),

  otp: z.string().regex(/^\d{6}$/, "OTP must be exactly 6 digits"),

  device: z
    .object({
      name: z.string().trim().min(1).max(120),
      model: z.string().trim().min(1).max(120).optional(),
      platform: z.enum(["android", "ios", "web", "unknown"]),
      osVersion: z.string().trim().min(1).max(60).optional(),
      appVersion: z.string().trim().min(1).max(40).optional(),
    })
    .optional(),
});

export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
