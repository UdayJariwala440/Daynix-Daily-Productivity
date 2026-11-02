import {
  saveTask as saveTaskRepository,
  findTasksByUserId,
  findTaskById,
    deleteTask as deleteTaskRepository,
    TaskDateFilters,
} from "./task.repository.js";

import type { SaveTaskInput } from "./task.validation.js";

export async function saveTask(userId: string, input: SaveTaskInput) {
  const result = await saveTaskRepository(userId, input);

  if (result.operation === "list_not_found") {
    throw new Error("LIST_NOT_FOUND");
  }

  if (result.operation === "not_found") {
    throw new Error("TASK_NOT_FOUND");
  }

  if (result.operation === "no_changes") {
    throw new Error("NO_TASK_CHANGES");
  }

  return {
    message:
      result.operation === "created"
        ? "Task created successfully."
        : "Task updated successfully.",
    data: result.task,
  };
}

function getReminderName(reminder: string): string {
  const reminderNames: Record<string, string> = {
    none: "No reminder",
    at_time: "At time of task",
    "5_minutes": "5 minutes before",
    "10_minutes": "10 minutes before",
    "15_minutes": "15 minutes before",
    "30_minutes": "30 minutes before",
    "1_hour": "1 hour before",
    "1_day": "1 day before",
  };

  return reminderNames[reminder] ?? "No reminder";
}

export async function getTasks(
  userId: string,
  filters: TaskDateFilters = {},
) {
  const tasks = await findTasksByUserId(userId, filters);

  const formattedTasks = tasks.map((task) => ({
    ...task,
    reminder_name: getReminderName(task.reminder),
  }));

  return {
    data: formattedTasks,
  };
}

export async function getTaskById(userId: string, taskId: string) {
  const task = await findTaskById(userId, taskId);

  if (!task) {
    throw new Error("TASK_NOT_FOUND");
  }

  return {
    data: task,
  };
}

export async function deleteTask(userId: string, taskId: string) {
  const deletedTask = await deleteTaskRepository(userId, taskId);

  if (!deletedTask) {
    throw new Error("TASK_NOT_FOUND");
  }

  return {
    message: "Task deleted successfully.",
  };
}
