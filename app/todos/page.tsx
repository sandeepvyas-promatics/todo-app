"use client";

import { useEffect, useState } from "react";
import TodoList from "../components/TodoList";
import Link from "next/link";

interface Todo {
  id: number;
  name: string;
  description: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  completed: boolean;
}

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const savedTodos = localStorage.getItem("todos");

    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  function toggleComplete(id: number) {
    const updatedTodos = todos.map((todo) =>
      todo.id === id
        ? { ...todo, completed: !todo.completed }
        : todo
    );

    setTodos(updatedTodos);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
  }

  function deleteTodo(id: number) {
    const updatedTodos = todos.filter(
      (todo) => todo.id !== id
    );

    setTodos(updatedTodos);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
  }

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        Your Todos
      </h1>

      <TodoList
        todos={todos}
        onToggle={toggleComplete}
        onDelete={deleteTodo}
      />

      <Link
        href="/"
        className="inline-block mt-6 bg-blue-600 text-white px-4 py-2 rounded-md"
      >
        Add Todo
      </Link>
    </main>
  );
}