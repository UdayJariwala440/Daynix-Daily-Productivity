import { pool } from "../../config/database.js";
import type { SaveTaskInput } from "./task.validation.js";

export async function saveTask(userId: string, input: SaveTaskInput) {
  if (!input.id) {
    const result = await pool.query(
      `INSERT INTO tasks (
        user_id,
        list_id,
        name,
        description,
        start_date,
        start_time,
        priority,
        reminder,
        status
      )
      SELECT
        $1, l.id, $3, $4, $5, $6, $7, $8, $9
      FROM task_lists l
      WHERE l.id = $2 AND l.user_id = $1
      RETURNING
        id,
        user_id,
        list_id,
        name,
        description,
        start_date,
        start_time,
        priority,
        reminder,
        status,
        is_completed,
        created_at,
        updated_at`,
      [
        userId,
        input.list_id,
        input.name,
        input.description ?? null,
        input.start_date ?? null,
        input.start_time ?? null,
        input.priority ?? "medium",
        input.reminder ?? "none",
        input.status ?? "pending",
      ],
    );

    if (result.rows.length === 0) {
      return { operation: "list_not_found" as const, task: null };
    }

    return { operation: "created" as const, task: result.rows[0] };
  }

  const fields: string[] = [];
  const values: unknown[] = [input.id, userId];
  let index = 3;

  if (input.list_id !== undefined) {
    fields.push(`list_id = $${index++}`);
    values.push(input.list_id);
  }

  if (input.name !== undefined) {
    fields.push(`name = $${index++}`);
    values.push(input.name);
  }

  if (input.description !== undefined) {
    fields.push(`description = $${index++}`);
    values.push(input.description);
  }

  if (input.start_date !== undefined) {
    fields.push(`start_date = $${index++}`);
    values.push(input.start_date);
  }

  if (input.start_time !== undefined) {
    fields.push(`start_time = $${index++}`);
    values.push(input.start_time);
  }

  if (input.priority !== undefined) {
    fields.push(`priority = $${index++}`);
    values.push(input.priority);
  }

  if (input.reminder !== undefined) {
    fields.push(`reminder = $${index++}`);
    values.push(input.reminder);
  }

  if (input.status !== undefined) {
    fields.push(`status = $${index++}`);
    values.push(input.status);
  }

  if (fields.length === 0) {
    return { operation: "no_changes" as const, task: null };
  }

  fields.push("updated_at = NOW()");

  const result = await pool.query(
    `UPDATE tasks AS t
     SET ${fields.join(", ")}
     WHERE t.id = $1
       AND t.user_id = $2
       AND EXISTS (
         SELECT 1
         FROM task_lists l
         WHERE l.id = t.list_id
           AND l.user_id = t.user_id
       )
       AND (
         $${index}::uuid IS NULL
         OR EXISTS (
           SELECT 1
           FROM task_lists l
           WHERE l.id = $${index}::uuid
             AND l.user_id = $2
         )
       )
     RETURNING
       t.id,
       t.user_id,
       t.list_id,
       t.name,
       t.description,
       t.start_date,
       t.start_time,
       t.priority,
       t.reminder,
       t.status,
       t.is_completed,
       t.created_at,
       t.updated_at`,
    [...values, input.list_id ?? null],
  );

  if (result.rows.length === 0) {
    return { operation: "not_found" as const, task: null };
  }

  return { operation: "updated" as const, task: result.rows[0] };
}

export async function findTaskById(userId: string, taskId: string) {
  const result = await pool.query(
    `SELECT
       id,
       list_id,
       name,
       description,
       start_date,
       start_time,
       priority,
       reminder,
       status,
       is_completed,
       created_at,
       updated_at
     FROM tasks
     WHERE id = $1 AND user_id = $2
     LIMIT 1`,
    [taskId, userId],
  );

  return result.rows[0] ?? null;
}


export async function deleteTask(userId: string, taskId: string) {
  const result = await pool.query(
    `DELETE FROM tasks
     WHERE id = $1 AND user_id = $2
     RETURNING id`,
    [taskId, userId],
  );

  return result.rows[0] ?? null;
}

export interface TaskDateFilters {
  date?: string;
  start_date?: string;
  end_date?: string;
}

export async function findTasksByUserId(
  userId: string,
  filters: TaskDateFilters = {},
) {
  const conditions = ["t.user_id = $1"];
  const values: unknown[] = [userId];

  if (filters.date) {
    values.push(filters.date);
    conditions.push(`t.start_date = $${values.length}::date`);
  } else {
    if (filters.start_date) {
      values.push(filters.start_date);
      conditions.push(`t.start_date >= $${values.length}::date`);
    }

    if (filters.end_date) {
      values.push(filters.end_date);
      conditions.push(`t.start_date <= $${values.length}::date`);
    }
  }

  const result = await pool.query(
    `SELECT
       t.id,
       t.list_id,
       l.name AS list_name,
       t.name,
       t.description,
       t.start_date,
       t.start_time,
       t.priority,
       t.reminder,
       t.status,
       t.is_completed,
       t.created_at,
       t.updated_at
     FROM tasks t
     INNER JOIN task_lists l
       ON l.id = t.list_id
       AND l.user_id = t.user_id
     WHERE ${conditions.join(" AND ")}
     ORDER BY
       t.start_date ASC NULLS LAST,
       t.start_time ASC NULLS LAST,
       t.created_at DESC`,
    values,
  );

  return result.rows;
}
