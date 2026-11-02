import type { Request, Response, NextFunction } from "express";
import { saveTaskSchema } from "./task.validation.js";
import {
  saveTask,
  getTasks,
  getTaskById,
  deleteTask,
} from "./task.service.js";
import z from "zod";

function getUserId(req: Request): string | null {
  const user = (req as Request & { user?: { id?: string } }).user;
  return user?.id ?? null;
}

export async function saveTaskController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userId = getUserId(req);

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  const parsed = saveTaskSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid task data.",
      errors: parsed.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  try {
    const result = await saveTask(userId, parsed.data);

    return res.status(parsed.data.id ? 200 : 201).json({
      success: true,
      ...result,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "LIST_NOT_FOUND") {
        return res.status(404).json({
          success: false,
          message: "List not found or does not belong to you.",
        });
      }

      if (error.message === "TASK_NOT_FOUND") {
        return res.status(404).json({
          success: false,
          message: "Task not found.",
        });
      }

      if (error.message === "NO_TASK_CHANGES") {
        return res.status(400).json({
          success: false,
          message: "Provide at least one field to update.",
        });
      }
    }

    return next(error);
  }
}

const taskDateFiltersSchema = z
  .object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  })
  .strict()
  .refine(
    (filters) => !(filters.date && (filters.start_date || filters.end_date)),
    {
      message: "Use either date or a date range, not both.",
    },
  )
  .refine(
    (filters) =>
      !filters.start_date ||
      !filters.end_date ||
      filters.start_date <= filters.end_date,
    {
      message: "start_date must be before or equal to end_date.",
    },
  );

export async function getTasksController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const parsedFilters = taskDateFiltersSchema.safeParse(req.query);

    if (!parsedFilters.success) {
      res.status(400).json({
        success: false,
        message: "Invalid date filters.",
        errors: parsedFilters.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
      return;
    }

    const userId = getUserId(req);
    const result = await getTasks(userId, parsedFilters.data);

    res.status(200).json({
      success: true,
      message: "Tasks fetched successfully.",
      ...result,
    });
  } catch (error) {
      console.error("Get tasks error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch tasks.",
    });
  }
}


export async function getTaskByIdController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userId = getUserId(req);

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  const taskId = req.params.id;

  if (typeof taskId !== "string") {
    return res.status(400).json({
      success: false,
      message: "Invalid task ID.",
    });
  }

  try {
    const result = await getTaskById(userId, taskId);

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "TASK_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }

    return next(error);
  }
}

export async function deleteTaskController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userId = getUserId(req);

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  const taskId = req.params.id;

  if (typeof taskId !== "string") {
    return res.status(400).json({
      success: false,
      message: "Invalid task ID.",
    });
  }

  try {
    const result = await deleteTask(userId, taskId);

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "TASK_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }

    return next(error);
  }
}
