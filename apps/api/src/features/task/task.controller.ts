import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { saveTaskSchema, updateTaskStatusSchema } from "./task.validation.js";
import {
  saveTask,
  getTasks,
  getTaskById,
  deleteTask,
  updateTaskStatus,
} from "./task.service.js";

function getUserId(req: Request): string | null {
  const user = (req as Request & { user?: { id?: string } }).user;
  return user?.id ?? null;
}

function unauthorized(res: Response) {
  return res.status(401).json({
    success: false,
    message: "Authentication required.",
  });
}

function formatZodErrors(error: z.ZodError) {
  return error.issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));
}

export async function saveTaskController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userId = getUserId(req);
  if (!userId) return unauthorized(res);

  const parsed = saveTaskSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid task data.",
      errors: formatZodErrors(parsed.error),
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

const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

const taskDateFiltersSchema = z
  .object({
    date: dateString.optional(),
    start_date: dateString.optional(),
    end_date: dateString.optional(),
  })
  .strict()
  .refine(
    (f) => !(f.date && (f.start_date || f.end_date)),
    { message: "Use either date or a date range, not both." },
  )
  .refine(
    (f) => !f.start_date || !f.end_date || f.start_date <= f.end_date,
    { message: "start_date must be before or equal to end_date." },
  );

export async function getTasksController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userId = getUserId(req);
  if (!userId) return unauthorized(res);

  const parsedFilters = taskDateFiltersSchema.safeParse(req.query);

  if (!parsedFilters.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid date filters.",
      errors: formatZodErrors(parsedFilters.error),
    });
  }

  try {
    const result = await getTasks(userId, parsedFilters.data);

    return res.status(200).json({
      success: true,
      message: "Tasks fetched successfully.",
      ...result,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getTaskByIdController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userId = getUserId(req);
  if (!userId) return unauthorized(res);

  const taskId = req.params.id;

  if (typeof taskId !== "string") {
    return res.status(400).json({
      success: false,
      message: "Invalid task ID.",
    });
  }

  try {
    const result = await getTaskById(userId, taskId);

    return res.status(200).json({ success: true, ...result });
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
  if (!userId) return unauthorized(res);

  const taskId = req.params.id;

  if (typeof taskId !== "string") {
    return res.status(400).json({
      success: false,
      message: "Invalid task ID.",
    });
  }

  try {
    const result = await deleteTask(userId, taskId);

    return res.status(200).json({ success: true, ...result });
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

export async function updateTaskStatusController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userId = getUserId(req);
  if (!userId) return unauthorized(res);

  const taskId = req.params.id;

  if (
    typeof taskId !== "string" ||
    !z.string().uuid().safeParse(taskId).success
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid task ID.",
    });
  }

  const parsed = updateTaskStatusSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid task status.",
      errors: formatZodErrors(parsed.error),
    });
  }

  try {
    const result = await updateTaskStatus(userId, taskId, parsed.data);

    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    if (error instanceof Error && error.message === "TASK_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }

    console.error("updateTaskStatus error:", error);
    return next(error);
  }
}