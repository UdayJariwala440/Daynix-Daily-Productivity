
import {
  saveList as saveListRepository,
  findListsByUserId,
  findListById,
} from "./list.repository.js";

import type { SaveListInput } from "./list.validation.js";

export async function saveList(
  userId: string,
  input: SaveListInput,
) {
  const result = await saveListRepository(userId, input);

  if (result.operation === "not_found") {
    throw new Error("LIST_NOT_FOUND");
  }

  return {
    message:
      result.operation === "created"
        ? "List created successfully."
        : "List updated successfully.",
    data: result.list,
  };
}

export async function getLists(userId: string) {
  const lists = await findListsByUserId(userId);

  return {
    data: lists,
  };
}

export async function getListById(
  userId: string,
  listId: string,
) {
  const list = await findListById(userId, listId);

  if (!list) {
    throw new Error("LIST_NOT_FOUND");
  }

  return {
    data: list,
  };
}
