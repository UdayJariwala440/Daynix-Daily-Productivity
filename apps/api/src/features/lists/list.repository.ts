import { pool } from "../../config/database.js";
import type { SaveListInput } from "./list.validation.js";

export async function saveList(
  userId: string,
  input: SaveListInput,
) {
  // Create a new list when no ID is provided.
  if (!input.id) {
    const result = await pool.query(
      `INSERT INTO task_lists (user_id, name, color, sub_color)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, color, sub_color, created_at, updated_at`,
      [
        userId,
        input.name,
        input.color ?? "#6938EF",
        input.sub_color ?? "#EEE8FF",
      ],
    );

    return {
      operation: "created" as const,
      list: result.rows[0],
    };
  }

  // Update an existing list owned by this user.
  const fields: string[] = [];
  const values: unknown[] = [input.id, userId];
  let index = 3;

  if (input.name !== undefined) {
    fields.push(`name = $${index++}`);
    values.push(input.name);
  }

  if (input.color !== undefined) {
    fields.push(`color = $${index++}`);
    values.push(input.color);
  }

  if (input.sub_color !== undefined) {
    fields.push(`sub_color = $${index++}`);
    values.push(input.sub_color);
  }

  fields.push("updated_at = NOW()");

  const result = await pool.query(
    `UPDATE task_lists
     SET ${fields.join(", ")}
     WHERE id = $1 AND user_id = $2
     RETURNING id, name, color, sub_color, created_at, updated_at`,
    values,
  );

  if (result.rows.length === 0) {
    return {
      operation: "not_found" as const,
      list: null,
    };
  }

  return {
    operation: "updated" as const,
    list: result.rows[0],
  };
}

export async function findListsByUserId(userId: string) {
  const result = await pool.query(
    `SELECT id, name, color, sub_color, created_at, updated_at
     FROM task_lists
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [userId],
  );

  return result.rows;
}

export async function findListById(
  userId: string,
  listId: string,
) {
  const result = await pool.query(
    `SELECT id, name, color, sub_color, created_at, updated_at
     FROM task_lists
     WHERE id = $1 AND user_id = $2
     LIMIT 1`,
    [listId, userId],
  );

  return result.rows[0] ?? null;
}
