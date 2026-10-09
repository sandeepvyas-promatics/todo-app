"use client";

import { useRouter } from "next/navigation";
import TodoForm from "../components/TodoForm";
import api from "../../lib/api";
import AppHeader from "../components/AppHeader";
interface TodoData {
  name: string;
  description: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
}

export default function AddTodoPage() {
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
    <div>
  <AppHeader />
  <main className="min-h-screen bg-linear-to-b from-gray-950 via-black to-gray-950 flex flex-col items-center px-4 py-12">
    
    <div className="text-center mb-8">
      <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
        Add new todo
      </h1>
      <p className="mt-2 text-sm text-gray-400">
        Write down what you need to get done
      </p>
    </div>

    <div className="w-full max-w-xl bg-gray-900/70 border border-gray-800 rounded-2xl shadow-xl shadow-black/40 p-6 md:p-8 backdrop-blur">
      <TodoForm onAdd={addTodo} />
    </div>

    <button
      onClick={() => router.push("/todos")}
      className="mt-8 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-semibold px-8 py-3 rounded-xl shadow-lg shadow-blue-900/40 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-black"
    >
      View Todos
    </button>
  </main>
</div>
    
  );
}