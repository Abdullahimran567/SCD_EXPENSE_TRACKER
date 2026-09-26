"use client";

import Link from "next/link";
import { Wallet, Plus } from "lucide-react";

interface NavbarProps {
  onAddTransaction?: () => void;
  user?: {
    name?: string;
    email?: string;
  } | null;
}

export default function Navbar({ onAddTransaction, user }: NavbarProps) {
  const userName = user?.name || "User";
  const userEmail = user?.email || "";

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
            <div className="text-sm font-semibold text-slate-900">Welcome, {userName}</div>
            {userEmail && <div className="text-xs text-slate-400">{userEmail}</div>}
          </div>

          {/* Add Transaction Button */}
          <button
            onClick={onAddTransaction}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs flex items-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Transaction</span>
          </button>

          {/* User Avatar */}
          <div className="w-9 h-9 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-sm shrink-0">
            {userName.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}
