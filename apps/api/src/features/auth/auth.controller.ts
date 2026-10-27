import type { Request, Response, NextFunction } from "express";
import { signupSchema } from "./auth.validation.js";
import { requestSignupOtp } from "./auth.service.js";

export async function signup(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const validation = signupSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: "Invalid signup details.",
        errors: validation.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
      return;
    }

    const result = await requestSignupOtp(validation.data);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
}