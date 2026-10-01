"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  UserCircle,
  ShieldCheck,
  LogOut,
  Trash2,
} from "lucide-react";

import api from "../../lib/api";

interface User {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
}

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await api.get("/auth/me");

        console.log("CURRENT USER:", response.data);

        setUser(response.data.user);
      } catch (error) {
        console.error("GET CURRENT USER ERROR:", error);
      }
    }

    fetchUser();
  }, []);

  // LOGOUT
  async function handleLogout() {
    const confirmed = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.post("/auth/logout");

      router.push("/login");
    } catch (error) {
      console.error("LOGOUT ERROR:", error);
    }
  }

  // DELETE ACCOUNT
  async function handleDeleteAccount() {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This will permanently delete your account and all your todos."
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete("/auth/delete-account");

      router.push("/login");
    } catch (error) {
      console.error("DELETE ACCOUNT ERROR:", error);
    }
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-gray-400">
          Loading...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">

      {/* HEADER */}
      <header className="border-b border-gray-800">

        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">

          <h1 className="text-xl font-bold">
            Todo App
          </h1>

          <UserCircle
            size={30}
            className="text-gray-300"
          />

        </div>

      </header>


      {/* MAIN CONTENT */}
      <div className="max-w-5xl mx-auto px-4 py-8">

        <div className="mb-8">

          <h2 className="text-3xl font-bold">
            Dashboard
          </h2>

          <p className="text-gray-400 mt-1">
            Manage your account
          </p>

        </div>


        {/* ACCOUNT DETAILS */}
        <div className="border border-gray-800 rounded-md p-5 mb-6">

          <h3 className="text-lg font-semibold mb-5">
            Account Details
          </h3>

          <div className="space-y-4">

            <div>
              <p className="text-sm text-gray-500">
                Name
              </p>

              <p className="mt-1">
                {user.name}
              </p>
            </div>


            <div>
              <p className="text-sm text-gray-500">
                Email
              </p>

              <p className="mt-1">
                {user.email}
              </p>
            </div>


            <div>
              <p className="text-sm text-gray-500">
                Account Status
              </p>

              <div className="flex items-center gap-2 mt-1">

                <ShieldCheck
                  size={18}
                  className="text-green-500"
                />

                <span className="text-green-500">
                  {user.isVerified
                    ? "Verified"
                    : "Not Verified"}
                </span>

              </div>

            </div>

          </div>

        </div>


        {/* TODO ACTIONS */}
        <div className="border border-gray-800 rounded-md p-5 mb-6">

          <h3 className="text-lg font-semibold mb-4">
            Todo Actions
          </h3>

          <div className="flex flex-col sm:flex-row gap-3">

            <Link
              href="/add-todo"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-md text-center"
            >
              + Add Todo
            </Link>


            <Link
              href="/todos"
              className="border border-gray-700 hover:bg-gray-900 px-5 py-3 rounded-md text-center"
            >
              View Todos
            </Link>

          </div>

        </div>


        {/* ACCOUNT ACTIONS */}
        <div className="border border-gray-800 rounded-md p-5 mb-6">

          <h3 className="text-lg font-semibold mb-4">
            Account Actions
          </h3>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-5 py-3 rounded-md"
          >

            <LogOut size={18} />

            Logout

          </button>

        </div>


        {/* DELETE ACCOUNT */}
        <div className="border border-red-900 rounded-md p-5">

          <h3 className="text-lg font-semibold text-red-500 mb-2">
            Delete Account
          </h3>

          <p className="text-sm text-gray-400 mb-4">
            This will permanently delete your account
            and all your todos.
          </p>

          <button
            type="button"
            onClick={handleDeleteAccount}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-5 py-3 rounded-md"
          >

            <Trash2 size={18} />

            Delete Account

          </button>

        </div>

      </div>

    </main>
  );
}