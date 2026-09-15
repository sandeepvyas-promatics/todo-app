"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import TodoForm from "./components/TodoForm";

interface Todo {
  id: number;
  name: string;
  description: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  completed: boolean;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loaded, setLoaded] = useState(false);


  useEffect(() => {
    const savedTodos = localStorage.getItem("todos");

    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }

    setLoaded(true);
  }, []);


  useEffect(() => {
    if (!loaded) return;

    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos, loaded]);

  function addTodo(newTodo: Omit<Todo, "completed">) {
    setTodos((prev) => [
      ...prev,
      {
        ...newTodo,
        completed: false,
      },
    ]);
  }
  return (
    <main className="min-h-screen bg-black flex flex-col items-center px-4 py-10">

      <h1 className="text-2xl font-bold text-white-800 mb-8">
        Add new todo  
      </h1>
      <div className="w-full max-w-xl">
        <TodoForm onAdd={addTodo} />
      </div>
        
        <Link href="/todos" className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition ">
        View Todos
        </Link>
    </main>
  );
}