"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TodoList from "../components/TodoList";
import AppHeader from "../components/AppHeader";
import Link from "next/link";
import api from "../../lib/api";
import axios from "axios";


// -----------------------------
// Frontend Todo type
// -----------------------------

interface Todo {
  id: string;
  name: string;
  description: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  completed: boolean;
}


// -----------------------------
// Todo coming from backend
// -----------------------------

interface ApiTodo {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  completed: boolean;
}


// -----------------------------
// Statistics from aggregation
// -----------------------------

interface TodoStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  high: number;
  medium: number;
  low: number;
}


// -----------------------------
// Complete API response
// -----------------------------

interface TodosResponse {
  stats: TodoStats;
  todos: ApiTodo[];
  totalMatching: number;
}


export default function TodosPage() {

  const router = useRouter();


  // -----------------------------
  // Todos
  // -----------------------------

  const [todos, setTodos] = useState<Todo[]>([]);


  // -----------------------------
  // Statistics
  // -----------------------------

  const [stats, setStats] = useState<TodoStats>({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0,
    high: 0,
    medium: 0,
    low: 0,
  });


  // -----------------------------
  // Number of todos matching
  // current filter
  // -----------------------------

  const [totalMatching, setTotalMatching] = useState(0);


  // -----------------------------
  // Filters / sorting
  // -----------------------------

  const [status, setStatus] = useState("all");

  const [priority, setPriority] = useState("all");

  const [sort, setSort] = useState("dueDateAsc");


  // -----------------------------
  // Loading
  // -----------------------------

  const [loading, setLoading] = useState(true);


  // ============================================================
  // FETCH TODOS
  // ============================================================

  const fetchTodos = useCallback(async () => {

    try {

      setLoading(true);

      const response = await api.get<TodosResponse>("/todos", {
        params: {
          status,
          priority,
          sort,
        },
      });


      console.log("API RESPONSE:", response.data);


      // Get data from backend

      const {
        stats,
        todos: apiTodos,
        totalMatching,
      } = response.data;


      // -----------------------------
      // Convert backend Todo
      // to frontend Todo
      // -----------------------------

      const formattedTodos: Todo[] = apiTodos.map((todo) => ({
        id: todo._id,
        name: todo.title,
        description: todo.description,
        dueDate: todo.dueDate,
        priority: todo.priority,
        completed: todo.completed,
      }));


      // -----------------------------
      // Update React state
      // -----------------------------

      setTodos(formattedTodos);

      setStats(stats);

      setTotalMatching(totalMatching);


    } catch (error) {

      console.error("API ERROR:", error);

    } finally {

      setLoading(false);

    }

  }, [status, priority, sort]);


  // ============================================================
  // FETCH WHEN PAGE LOADS
  // OR FILTER / SORT CHANGES
  // ============================================================

  useEffect(() => {

    fetchTodos();

  }, [fetchTodos]);


  // ============================================================
  // TOGGLE TODO
  // ============================================================

  async function toggleComplete(id: string) {

    try {

      const response = await api.patch(
        `/todos/${id}/toggle`
      );

      console.log(
        "TOGGLE RESPONSE:",
        response.data
      );


      // Refresh todos + statistics

      await fetchTodos();


    } catch (error) {

      console.log(
        "TOGGLE ERROR:",
        error
      );

    }

  }


  // ============================================================
  // DELETE TODO
  // ============================================================

  async function deleteTodo(id: string) {

    try {

      const response = await api.delete(
        `/todos/${id}`
      );

      console.log(
        "DELETED RESPONSE:",
        response.data
      );


      // Refresh todos + statistics

      await fetchTodos();


    } catch (error) {

      if (axios.isAxiosError(error)) {

        console.log(
          "DELETE ERROR:",
          error.response?.data
        );

      }

    }

  }


  // ============================================================
  // UPDATE TODO
  // ============================================================

  async function updateTodo(updatedTodo: Todo) {

    try {

      const updateData = {

        title: updatedTodo.name,

        description: updatedTodo.description,

        dueDate: updatedTodo.dueDate,

        priority: updatedTodo.priority
          .trim()
          .toLowerCase(),

        completed: updatedTodo.completed,

      };


      console.log(
        "UPDATE DATA BEING SENT:",
        updateData
      );


      const response = await api.patch(
        `/todos/${updatedTodo.id}`,
        updateData
      );


      console.log(
        "UPDATED RESPONSE:",
        response.data
      );


      // Refresh todos + statistics

      await fetchTodos();


    } catch (error) {

      if (axios.isAxiosError(error)) {

        console.log(
          "UPDATE ERROR RESPONSE:",
          error.response?.data
        );

      }

    }

  }


  // ============================================================
  // LOGOUT
  // ============================================================

  async function handleLogout() {

    const confirmed = confirm(
      "Are you sure you want to logout?"
    );


    if (!confirmed) {
      return;
    }


    try {

      await api.post("/auth/logout");

      router.push("/login");


    } catch (error) {

      console.log(
        "LOGOUT ERROR:",
        error
      );

    }

  }


  // ============================================================
  // UI
  // ============================================================

  return (

    <main className="min-h-screen bg-black text-white">

      <AppHeader />


      <div className="max-w-6xl mx-auto px-6 py-8">


        {/* =====================================================
            PAGE HEADER
        ====================================================== */}

        <div className="flex items-center justify-between mb-8">

          <div>

            <h1 className="text-3xl font-bold">
              My Todos
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



        {/* =====================================================
            STATISTICS
        ====================================================== */}

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">


          {/* Total */}

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">

            <p className="text-gray-400 text-sm">
              Total
            </p>

            <p className="text-2xl font-bold mt-1">
              {stats.total}
            </p>

          </div>


          {/* Completed */}

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">

            <p className="text-gray-400 text-sm">
              Completed
            </p>

            <p className="text-2xl font-bold mt-1">
              {stats.completed}
            </p>

          </div>


          {/* Pending */}

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">

            <p className="text-gray-400 text-sm">
              Pending
            </p>

            <p className="text-2xl font-bold mt-1">
              {stats.pending}
            </p>

          </div>


          {/* High */}

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">

            <p className="text-gray-400 text-sm">
              High
            </p>

            <p className="text-2xl font-bold mt-1">
              {stats.high}
            </p>

          </div>


          {/* Medium */}

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">

            <p className="text-gray-400 text-sm">
              Medium
            </p>

            <p className="text-2xl font-bold mt-1">
              {stats.medium}
            </p>

          </div>

        </div>



        {/* =====================================================
            PRIORITY + OVERDUE INFORMATION
        ====================================================== */}

        <div className="flex flex-wrap gap-4 mb-8 text-sm">

          <span className="text-gray-400">
            Low:
            <span className="text-white ml-2 font-semibold">
              {stats.low}
            </span>
          </span>


          <span className="text-gray-400">
            High:
            <span className="text-white ml-2 font-semibold">
              {stats.high}
            </span>
          </span>


          <span className="text-gray-400">
            Overdue:
            <span className="text-white ml-2 font-semibold">
              {stats.overdue}
            </span>
          </span>

        </div>



        {/* =====================================================
            FILTERS
        ====================================================== */}

        <div className="flex flex-wrap gap-4 mb-8">


          {/* Sort */}

          <div className="flex flex-col gap-2">

            <label className="text-sm text-gray-400">
              Sort by
            </label>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-white outline-none"
            >

              <option value="dueDateAsc">
                Due Date ↑
              </option>

              <option value="dueDateDesc">
                Due Date ↓
              </option>

              <option value="newest">
                Newest
              </option>

              <option value="oldest">
                Oldest
              </option>

            </select>

          </div>



          {/* Status Filter */}

          <div className="flex flex-col gap-2">

            <label className="text-sm text-gray-400">
              Filter
            </label>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-white outline-none"
            >

              <option value="all">
                All
              </option>

              <option value="pending">
                Pending
              </option>

              <option value="completed">
                Completed
              </option>

              <option value="overdue">
                Overdue
              </option>

            </select>

          </div>



          {/* Priority Filter */}

          <div className="flex flex-col gap-2">

            <label className="text-sm text-gray-400">
              Priority
            </label>

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-white outline-none"
            >

              <option value="all">
                All
              </option>

              <option value="high">
                High
              </option>

              <option value="medium">
                Medium
              </option>

              <option value="low">
                Low
              </option>

            </select>

          </div>


        </div>



        {/* =====================================================
            MATCHING COUNT
        ====================================================== */}

        <div className="text-gray-400 text-sm mb-4">

          Showing{" "}

          <span className="text-white font-semibold">
            {totalMatching}
          </span>

          {" "}todos

        </div>



        {/* =====================================================
            TODO LIST
        ====================================================== */}

        {loading ? (

          <div className="text-center text-gray-400 py-10">
            Loading todos...
          </div>

        ) : todos.length === 0 ? (

          <div className="text-center text-gray-400 py-10">

            No todos found.

          </div>

        ) : (

          <TodoList
            todos={todos}
            onToggle={toggleComplete}
            onDelete={deleteTodo}
            onUpdate={updateTodo}
          />

        )}

      </div>

    </main>

  );
}