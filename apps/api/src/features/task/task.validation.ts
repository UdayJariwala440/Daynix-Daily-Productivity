import { z } from "zod";

const reminderSchema = z.enum([
  "none",
  "at_time",
  "5_minutes",
  "10_minutes",
  "15_minutes",
  "30_minutes",
  "1_hour",
  "1_day",
]);

const prioritySchema = z.enum(["low", "medium", "high"]);

const taskStatusSchema = z.enum([
  "pending",
  "in_progress",
  "paused",
]);

export const saveTaskSchema = z
  .object({
    id: z.string().uuid("Invalid task ID.").optional(),

    name: z
      .string()
      .trim()
      .min(1, "Task name is required.")
      .max(200, "Task name must not exceed 200 characters."),

    description: z
      .string()
      .trim()
      .max(5000, "Description must not exceed 5000 characters.")
      .nullable()
      .optional(),

    list_id: z.string().uuid("Invalid list ID."),

    start_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid start date format. Use YYYY-MM-DD.")
      .nullable()
      .optional(),

    start_time: z
      .string()
      .regex(
        /^([01]\d|2[0-3]):[0-5]\d$/,
        "Invalid start time format. Use HH:mm.",
      )
      .nullable()
      .optional(),

    priority: prioritySchema.optional(),
    reminder: reminderSchema.optional(),
    status: taskStatusSchema.optional(),
  })
  .strict();

export type SaveTaskInput = z.infer<typeof saveTaskSchema>;