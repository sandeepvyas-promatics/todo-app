"use client";

import { useEffect, useState } from "react";
import TodoList from "../components/TodoList";
import Link from "next/link";
import api from "../../lib/api";
import axios from "axios";

interface Todo {
  id: string;
  name: string;
  description: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  completed: boolean;
}

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
   async function fetchTodos() {
    try {
      const response = await api.get("/todos");

      console.log("API RESPONSE:", response.data);

      const apiTodos = response.data.data;

      const formattedTodos: Todo[] = apiTodos.map((todo: any) => ({
        id: todo._id,
        name: todo.title,
        description: todo.description,
        dueDate: todo.dueDate,
        priority: todo.priority,
        completed: todo.completed,
      }));

      setTodos(formattedTodos);

    } catch (error) {
      console.error("API ERROR:", error);
    }
  }

  fetchTodos();
}, []);

    async function toggleComplete(id: string) {
      try{
        const response= await api.patch(`/todos/${id}/toggle`);
        console.log("TOGGLE RESPONSE: ", response.data);
        const updatedTodo = response.data.data;

        setTodos((prevTodos)=>
        prevTodos.map((todo)=>
          todo.id === id ?{
            ...todo,
            completed: updatedTodo.completed,
          }
        :todo
        )
      );
      } catch(error){
        console.log("TOGGLE ERROR: ",error);
      }
    }

  async function deleteTodo(id: string) {
  try {
    const response = await api.delete(`/todos/${id}`);

    console.log("DELETED RESPONSE:", response.data);

    setTodos((prevTodos) =>
      prevTodos.filter((todo) => todo.id !== id)
    );
  } catch (error) {
    if (axios.isAxiosError(error)){
    console.log("DELETED RESPONSE:",error.response?.data);}
  }
}

  async function updateTodo(updatedTodo: Todo) {
  try {
    const updateData = {
      title: updatedTodo.name,
      description: updatedTodo.description,
      dueDate: updatedTodo.dueDate,
      priority: updatedTodo.priority.trim().toLowerCase(),
      completed: updatedTodo.completed,
    };

    console.log("UPDATE DATA BEING SENT:", updateData);

    const response = await api.patch(`/todos/${updatedTodo.id}`,updateData
    );

    console.log("UPDATED RESPONSE:", response.data);

    const updatedApiTodo = response.data.data;

    const formattedTodo: Todo = {
      id: updatedApiTodo._id,
      name: updatedApiTodo.title,
      description: updatedApiTodo.description,
      dueDate: updatedApiTodo.dueDate,
      priority: updatedApiTodo.priority,
      completed: updatedApiTodo.completed,
    };

    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === formattedTodo.id
          ? formattedTodo
          : todo
      )
    );
  } catch (error) {
    if (axios.isAxiosError(error)){
    console.log("UPDATE ERROR RESPONSE:",error.response?.data);}
  }
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
        onUpdate={updateTodo}
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