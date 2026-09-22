import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleTodo,
} from "../controllers/todoController.js";

const router = express.Router();

// GET /todos -> all Todos
router.get("/todos",authMiddleware ,getTodos);

// GET /todos/:id -> one Todo
router.get("/todos/:id", getTodoById);

// PATCH /todos/:id/toggle -> toggle completed status
router.patch("/todos/:id/toggle", toggleTodo);

// POST /todos -> create Todo
router.post("/todos", createTodo);

// PATCH /todos/:id -> update Todo
router.patch("/todos/:id", updateTodo);

// DELETE /todos/:id -> delete Todo
router.delete("/todos/:id", deleteTodo);

export default router;