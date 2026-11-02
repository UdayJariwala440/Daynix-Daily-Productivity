import { Router } from "express";
import { authenticateToken } from "../../middleware/auth.middleware.js";
import {
  saveTaskController,
  getTasksController,
  getTaskByIdController,
  deleteTaskController,
} from "./task.controller.js";

const router = Router();

// All task routes require authentication.
router.use(authenticateToken);

// Create or update a task.
router.post("/create-update", saveTaskController);

// Get all tasks belonging to the authenticated user.
router.get("/list", getTasksController);

// Get a single task by ID.
router.get("/:id", getTaskByIdController);

// Delete a task by ID.
router.delete("/:id", deleteTaskController);

export default router;
