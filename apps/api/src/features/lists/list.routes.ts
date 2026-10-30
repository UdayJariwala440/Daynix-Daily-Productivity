import { Router } from "express";

import { authenticateToken } from "../../middleware/auth.middleware.js";

import {
  saveListController,
  getListsController,
  getListByIdController,
} from "./list.controller.js";

const router = Router();

// All list endpoints require authentication.
router.use(authenticateToken);

// Create a new list or update an existing list.
router.post("/", saveListController);

// Get all lists belonging to the logged-in user.
router.get("/", getListsController);

// Get one list by ID.
router.get("/:id", getListByIdController);

export default router;
