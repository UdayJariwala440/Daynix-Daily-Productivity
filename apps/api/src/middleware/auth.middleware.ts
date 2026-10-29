import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { pool } from "../config/database.js";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    sessionId: string;
  };
}

export async function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Access token is required.",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Invalid authorization header.",
    });
  }

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    return res.status(500).json({
      success: false,
      message: "Authentication configuration error.",
    });
  }

  try {
    const payload = jwt.verify(token, jwtSecret, {
      issuer: "daynix-api",
      audience: "daynix-app",
    });

    if (
      typeof payload === "string" ||
      typeof payload.sub !== "string" ||
      typeof payload.email !== "string" ||
      typeof payload.sid !== "string"
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid access token.",
      });
    }

    const session = await pool.query(
      `SELECT id
       FROM user_sessions
       WHERE id = $1
         AND user_id = $2
         AND revoked_at IS NULL
         AND expires_at > NOW()
       LIMIT 1`,
      [payload.sid, payload.sub],
    );

    if (session.rowCount !== 1) {
      return res.status(401).json({
        success: false,
        message: "This session is no longer active.",
      });
    }

    req.user = {
      id: payload.sub,
      email: payload.email,
      sessionId: payload.sid,
    };

    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired access token.",
    });
  }
}
