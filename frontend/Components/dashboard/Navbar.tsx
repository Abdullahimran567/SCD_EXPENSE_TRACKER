"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Wallet, Plus } from "lucide-react";

export interface User {
  name?: string;
  email?: string;
}

interface NavbarProps {
  onAddTransaction?: () => void;
  user?: User | null;
}

export default function Navbar({ onAddTransaction, user: propUser }: NavbarProps) {
  const [userData, setUserData] = useState<User | null>(propUser || null);

  useEffect(() => {
    if (propUser) {
      setUserData(propUser);
      return;
    }

    // Load from localStorage for immediate display if available
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUserData(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
      }
    }

    // Fetch user info from database via /auth/me
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
    fetch(`${backendUrl}/auth/me`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.success && data?.user) {
          setUserData(data.user);
          localStorage.setItem("user", JSON.stringify(data.user));
        }
      })
      .catch((err) => {
        console.error("Failed to fetch user profile:", err);
      });
  }, [propUser]);

  const userName = userData?.name || "User";
  const userEmail = userData?.email || "";

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-xs">
            <Wallet className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">
            Expense<span className="text-indigo-600">Mate</span>
          </span>
        </Link>

        {/* Right Section: User details & Actions */}
        <div className="flex items-center gap-4">
          {/* User info */}
          <div className="hidden sm:block text-right">
            <div className="text-sm font-semibold text-slate-900">
              Welcome, {userName}
            </div>
            {userEmail && (
              <div className="text-xs text-slate-400">{userEmail}</div>
            )}
          </div>

          {/* Add Transaction Button */}
          <button
            onClick={onAddTransaction}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs flex items-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>
    </header>
  );
}
