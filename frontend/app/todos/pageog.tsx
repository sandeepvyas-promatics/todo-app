"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; 
import TodoList from "../components/TodoList";
import AppHeader from "../components/AppHeader";
import { UserCircle } from "lucide-react";
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
  const router = useRouter();
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
   async function fetchTodos() {
    try {
      const response = await api.get("/todos");

      console.log("API RESPONSE:", response.data);

      const apiTodos = response.data;//.data

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
        const updatedTodo = response.data;//.data;

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

    const response = await api.patch(`/todos/${updatedTodo.id}`,updateData);

    console.log("UPDATED RESPONSE:", response.data);

    const updatedApiTodo = response.data;//.data;

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

async function handleLogout(){
   const confirmed = confirm("Are you sure you want to logout?");

  if (!confirmed) {
    return;
  }
  try{
    await api.post("/auth/logout");
    router.push("/login");
  }catch(error){
    console.log("LOGOUT ERROR: ",error);
  }
}
  return (
  <main className="min-h-screen bg-black text-white">

    <AppHeader />

    <div className="max-w-6xl mx-auto px-6 py-8">

      {/* Page heading */}
      <div className="flex items-center justify-between mb-8">

        <div>
          <h1 className="text-3xl font-bold">
            Your Todos
          </h1>

          <p className="text-gray-400 mt-1">
            Manage your tasks
          </p>
        </div>

        <Link
          href="/add-todo"
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition"
        >
          + Add Todo
        </Link>

      </div>
      

      {/* Todo list */}
      <TodoList
        todos={todos}
        onToggle={toggleComplete}
        onDelete={deleteTodo}
        onUpdate={updateTodo}
      />

    </div>

  </main>
);
}