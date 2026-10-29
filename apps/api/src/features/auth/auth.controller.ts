import type { Request, Response, NextFunction } from "express";
import {
  loginSchema,
  refreshTokenSchema,
  resendOtpSchema,
  signupSchema,
  verifyOtpSchema,
} from "./auth.validation.js";
import {
  logout,
  refreshAccessToken,
  requestLoginOtp,
  requestSignupOtp,
  resendOtp,
  verifyOtp,
  getSessions,
  removeSession,
  removeOtherSessions,
} from "./auth.service.js";
import { pool } from "../../config/database.js";

export async function signup(req: Request, res: Response, next: NextFunction) {
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

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = loginSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: "Invalid request data.",
        errors: parsed.error.issues,
      });
      return;
    }

    const result = await requestLoginOtp(parsed.data);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
}

export async function verifyOtpController(req: Request, res: Response) {
  const parsed = verifyOtpSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid email or OTP format.",
    });
  }

  try {
    const result = await verifyOtp({
      ...parsed.data,
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    const { created, ...response } = result;

    return res.status(created ? 201 : 200).json({
      success: true,
      ...response,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Login verification failed.";

    const status = message.startsWith("Too many OTP attempts") ? 429 : 400;

    return res.status(status).json({
      success: false,
      message,
    });
  }
}

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    sessionId: string;
  };
}

export async function listSessionsController(
  req: AuthenticatedRequest,
  res: Response,
) {
  if (!req.user) {
    return res
      .status(401)
      .json({ success: false, message: "Authentication required." });
  }

  try {
    const sessions = await getSessions(req.user.id, req.user.sessionId);
    return res.status(200).json({ success: true, sessions });
  } catch (error) {
    console.error("List sessions failed:", error);
    return res
      .status(500)
      .json({ success: false, message: "Unable to retrieve sessions." });
  }
}

export async function revokeSessionController(
  req: AuthenticatedRequest,
  res: Response,
) {
  if (!req.user) {
    return res
      .status(401)
      .json({ success: false, message: "Authentication required." });
  }

  try {
    const sessionId = req.params.sessionId;

    if (typeof sessionId !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "A valid session id is required." });
    }

    const revoked = await removeSession(req.user.id, sessionId);

    if (!revoked) {
      return res
        .status(404)
        .json({ success: false, message: "Active session not found." });
    }

    return res.status(200).json({
      success: true,
      message: "Session logged out successfully.",
      currentSessionRevoked: sessionId === req.user.sessionId,
    });
  } catch (error) {
    console.error("Revoke session failed:", error);
    return res
      .status(500)
      .json({ success: false, message: "Unable to log out this session." });
  }
}

export async function revokeOtherSessionsController(
  req: AuthenticatedRequest,
  res: Response,
) {
  if (!req.user) {
    return res
      .status(401)
      .json({ success: false, message: "Authentication required." });
  }

  try {
    const revokedCount = await removeOtherSessions(
      req.user.id,
      req.user.sessionId,
    );
    return res.status(200).json({
      success: true,
      message: "Other devices logged out successfully.",
      revokedCount,
    });
  } catch (error) {
    console.error("Revoke other sessions failed:", error);
    return res
      .status(500)
      .json({ success: false, message: "Unable to log out other devices." });
  }
}

export async function getCurrentUserController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const result = await pool.query(
      `SELECT id, name, email, avatar_url, timezone, created_at, updated_at
       FROM users
       WHERE id = $1
       LIMIT 1`,
      [req.user.id],
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "User account not found.",
      });
    }

    return res.status(200).json({
      success: true,
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Get current user failed:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve user details.",
    });
  }
}

export async function refreshTokenController(req: Request, res: Response) {
  const parsed = refreshTokenSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: "A valid refresh token is required.",
    });
  }

  try {
    const result = await refreshAccessToken(parsed.data);

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Invalid or expired refresh token."
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired refresh token.",
      });
    }

    console.error("Refresh token failed:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to refresh access token.",
    });
  }
}

export async function logoutController(req: Request, res: Response) {
  const parsed = refreshTokenSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: "A valid refresh token is required.",
    });
  }

  try {
    const result = await logout(parsed.data);

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Logout error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to log out.",
    });
  }
}

export async function resendOtpController(req: Request, res: Response) {
  const parsed = resendOtpSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid email address.",
      errors: parsed.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  try {
    const result = await resendOtp(parsed.data);

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to resend OTP.";

    if (message === "Invalid or expired OTP request.") {
      return res.status(400).json({
        success: false,
        message,
      });
    }

    console.error("Resend OTP failed:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to resend OTP.",
    });
  }
}
