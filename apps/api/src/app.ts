import express from "express";
import type { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import cors from "cors";
import { pool } from "./config/database.js";
import authRoutes from "./features/auth/auth.routes.js";
import listRoutes from "./features/lists/list.routes.js";

const app = express();

export function requestLogger(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const startTime = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - startTime;

    console.log(
      `[API] ${req.method} ${req.originalUrl} → ${res.statusCode} (${duration}ms)`,
    );
  });

  next();
}

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// API welcome endpoint
app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Welcome to the Daynix API!",
  });
});

// Health check endpoint
app.get("/health", async (_req, res) => {
  try {
    await pool.query("SELECT NOW()");

    res.status(200).json({
      success: true,
      message: "Daynix API and database are running",
      database: "connected",
    });
  } catch (error) {
    console.error("Database health check failed:", error);

    res.status(503).json({
      success: false,
      message: "Database connection failed",
      database: "disconnected",
    });
  }
});

// Authentication routes
app.use("/api/auth", authRoutes);
app.use("/api/lists", listRoutes);

export default app;