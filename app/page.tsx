"use client";

import { useRouter } from "next/navigation";
import TodoForm from "./components/TodoForm";
import api from "../lib/api";

interface TodoData {
  name: string;
  description: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
}

export default function Home() {
  const router = useRouter();

  async function addTodo(todo: TodoData) {
    try {
      const response = await api.post("/todos", {
        title: todo.name,
        description: todo.description,
        dueDate: todo.dueDate,
        priority: todo.priority,
      });

      console.log("POST RESPONSE:", response.data);

      router.push("/todos");
    } catch (error) {
      console.error("POST ERROR:", error);
    }
  }

  return (
    <main className="min-h-screen bg-black flex flex-col items-center px-4 py-10">
      <h1 className="text-2xl font-bold text-white mb-8">
        Add new todo
      </h1>

      <div className="w-full max-w-xl">
        <TodoForm onAdd={addTodo} />
      </div>

      <button
        onClick={() => router.push("/todos")}
        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition"
      >
        View Todos
      </button>
    </main>
  );
}