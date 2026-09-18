const express = require("express");
const router = express.Router();
const {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleTodo
  } = require("../controllers/todoController");

// GET /todos      -> Todo
router.get("/todos", getTodos);

// GET /todos/:id      -> one Todo
router.get("/todos/:id",getTodoById )

// PATCH /todos/:id/toggle -> toggle completed status
router.patch("/todos/:id/toggle",toggleTodo);

// POST /todos         -> create Todo
router.post("/todos",createTodo)

// PATCH /todos/:id    -> update Todo
router.patch("/todos/:id",updateTodo);

// DELETE /todos/:id   -> delete Todo
router.delete("/todos/:id",deleteTodo );

module.exports = router;