import express from "express";
import helmet from "helmet";
import cors from "cors";
import { pool } from "./config/database.js";
import authRoutes from "./features/auth/auth.routes.js";
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Welcome to the Daynix API!",
  });
});


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


app.use("/api/auth", authRoutes);

export default app;