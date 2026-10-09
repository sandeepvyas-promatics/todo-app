"use client";

import { useEffect, useState , useCallback} from "react";
import { useRouter } from "next/navigation"; 
import TodoList from "../components/TodoList";
import AppHeader from "../components/AppHeader";
import Link from "next/link";
import api from "../../lib/api";
import axios from "axios";


interface Todo {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  completed: boolean;
}
interface TodoStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  high: number;
  medium: number;
  low: number;
}

interface TodosResponse {
  stats: TodoStats;
  todos: Todo[];
  totalMatching: number;
}

export default function TodosPage() {
  const router = useRouter();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [stats, setStats] = useState<TodoStats>({ total : 0, completed : 0, pending : 0, overdue : 0, high : 0, medium : 0, low : 0});
  const [totalMatching, setTotalMatching] = useState(0);
  const [status, setStatus ] = useState("all");
  const [ priority, setPriority] = useState("all");
  const [sort, setSort] = useState("dueDateAsc");
  const [loading, setLoading] = useState(true);

  const [search , setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(()=>{
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 500);

    return ()=>{clearTimeout(timer)}; 
  },[search]);

  const fetchTodos = useCallback(async()=>{
    try{
        setLoading(true);
        const response = await api.get("/todos",{ params : { status, priority, sort , search : debouncedSearch},
        });
        const { stats, todos, totalMatching } = response.data;

        setTodos(todos);
        setStats(stats);
        setTotalMatching(totalMatching);
    }catch(error){
        console.error("API ERROR:", error);
    }finally{
        setLoading(false);
    }
  },[status, priority, sort, debouncedSearch]);

  useEffect(()=>{
    fetchTodos();
  },[fetchTodos]);

    async function toggleComplete(id: string) {
      try{
        const response= await api.patch(`/todos/${id}/toggle`);
        console.log("TOGGLE RESPONSE: ", response.data);
         await fetchTodos();
      } catch(error){
        console.log("TOGGLE ERROR: ",error);
      }
    }

  async function deleteTodo(id: string) {
  try {
    const response = await api.delete(`/todos/${id}`);

    console.log("DELETED RESPONSE:", response.data);

    await fetchTodos();

  } catch (error) {
    if (axios.isAxiosError(error)){
    console.log("DELETED RESPONSE:",error.response?.data);}
  }
}

  async function updateTodo(updatedTodo: Todo) {
  try {
    const updateData = {
      title: updatedTodo.title,
      description: updatedTodo.description,
      dueDate: updatedTodo.dueDate,
      priority: updatedTodo.priority.trim().toLowerCase(),
      completed: updatedTodo.completed,
    };

    console.log("UPDATE DATA BEING SENT:", updateData);

    const response = await api.patch(`/todos/${updatedTodo._id}`,updateData);

    console.log("UPDATED RESPONSE:", response.data);
    
    await fetchTodos();

    
  } catch (error) {
    if (axios.isAxiosError(error)){
    console.log("UPDATE ERROR RESPONSE:",error.response?.data);}
  }
}

// async function handleLogout(){
//    const confirmed = confirm("Are you sure you want to logout?");

//   if (!confirmed) {
//     return;
//   }
//   try{
//     await api.post("/auth/logout");
//     router.push("/login");
//   }catch(error){
//     console.log("LOGOUT ERROR: ",error);
//   }
// }
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
            {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Total</p>
          <p className="text-2xl font-bold mt-1">{stats.total}</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Completed</p>
          <p className="text-2xl font-bold mt-1">{stats.completed}</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Pending</p>
          <p className="text-2xl font-bold mt-1">{stats.pending}</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Overdue</p>
          <p className="text-2xl font-bold mt-1">{stats.overdue}</p>
        </div>

      </div>

      {/* Priority counts */}
      <div className="flex flex-wrap gap-4 mb-8 text-sm">
        <span className="text-gray-400">
          High: <span className="text-white ml-1 font-semibold">{stats.high}</span>
        </span>
        <span className="text-gray-400">
          Medium: <span className="text-white ml-1 font-semibold">{stats.medium}</span>
        </span>
        <span className="text-gray-400">
          Low: <span className="text-white ml-1 font-semibold">{stats.low}</span>
        </span>
      </div>

      {/* Filters */}

      
      <div className="flex flex-wrap items-end gap-4 mb-8">

        <div className="flex flex-col gap-2 flex-1 min-w-50">
          <label className="text-sm text-gray-400">Search</label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search todos..."
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-white outline-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-400">Sort by</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-white outline-none"
          >
            <option value="dueDateAsc">Due Date ↑</option>
            <option value="dueDateDesc">Due Date ↓</option>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-400">Filter</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-white outline-none"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-400">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-white outline-none"
          >
            <option value="all">All</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

      </div>

      {/* Showing count */}
      <div className="text-gray-400 text-sm mb-4">
        Showing <span className="text-white font-semibold">{totalMatching}</span> todos
      </div>
      
      {/* Todo list */}
      {loading && todos.length === 0 ? (
  <div className="text-center text-gray-400 py-10">Loading todos...</div>) : todos.length === 0 ? (
      <div className="text-center text-gray-400 py-10">No todos found.</div>
    ) : (
      <div className={loading ? "opacity-50 transition" : "transition"}>
        <TodoList
          todos={todos}
          onToggle={toggleComplete}
          onDelete={deleteTodo}
          onUpdate={updateTodo}
        />
      </div>
    )}

    </div>

  </main>
);
}