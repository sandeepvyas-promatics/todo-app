"use client";

import Link from "next/link";
import { UserCircle } from "lucide-react";

export default function AppHeader() {
  return (
    <header className="border-b border-gray-800 bg-black">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

        <Link
          href="/todos"
          className="text-xl font-bold text-white"
        >
          Todo App
        </Link>

        <Link
          href="/dashboard"
          title="Profile"
          className="text-gray-300 hover:text-blue-500 transition"
        >
          <UserCircle size={30} />
        </Link>

      </div>
    </header>
  );
}