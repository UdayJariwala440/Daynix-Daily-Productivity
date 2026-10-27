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