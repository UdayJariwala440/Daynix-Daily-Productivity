import type { Request, Response, NextFunction } from "express";

import {
  saveListSchema,
} from "./list.validation.js";

import {
  saveList,
  getLists,
  getListById,
} from "./list.service.js";

function getUserId(req: Request): string | null {
  const user = (req as Request & { user?: { id?: string } }).user;
  return user?.id ?? null;
}

export async function saveListController(
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

  const parsed = saveListSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid list data.",
      errors: parsed.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  try {
    const result = await saveList(userId, parsed.data);

    const statusCode = parsed.data.id ? 200 : 201;

    return res.status(statusCode).json({
      success: true,
      ...result,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "LIST_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "List not found.",
      });
    }

    if (
      error instanceof Error &&
      "code" in error &&
      error.code === "23505"
    ) {
      return res.status(409).json({
        success: false,
        message: "A list with this name already exists.",
      });
    }

    return next(error);
  }
}

export async function getListsController(
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

  try {
    const result = await getLists(userId);

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getListByIdController(
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

  const listId = req.params.id;

if (typeof listId !== "string") {
  return res.status(400).json({
    success: false,
    message: "Invalid list ID.",
  });
}

  try {
    const result = await getListById(userId, listId);

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "LIST_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "List not found.",
      });
    }

    return next(error);
  }
}
